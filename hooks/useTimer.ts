import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Session } from "@/types";

export function useTimer(user: User | null) {
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [totalToday, setTotalToday] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [sessionsToday, setSessionsToday] = useState<Session[]>([]);
    const [switchCount, setSwitchCount] = useState(0);
    const tickerRef = useRef<NodeJS.Timeout | null>(null);

    const fetchTodaySessions = useCallback(async () => {
        if (!user) return;
        const today = new Date().toISOString().split("T")[0];

        // Fetch completed sessions with joined project/task data
        const { data } = await supabase
            .from("sessions")
            .select("*, project:projects(*), task:tasks(*)")
            .eq("user_id", user.id)
            .gte("start_time", today)
            .not("end_time", "is", null)
            .order("start_time", { ascending: false });

        if (data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSessionsToday(data as any);
            const total = data.reduce((sum: number, s: { duration?: number }) => sum + (s.duration || 0), 0);
            setTotalToday(total);
        }
    }, [user]);

    const fetchDailySwitches = useCallback(async () => {
        if (!user) return;
        const today = new Date().toISOString().split("T")[0];

        const { count } = await supabase
            .from("context_switches")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", user.id)
            .gte("timestamp", today);

        if (count !== null) setSwitchCount(count);
    }, [user]);

    const checkActiveSession = useCallback(async () => {
        if (!user) return;

        // Check if there is an open session (no end_time)
        const { data } = await supabase
            .from("sessions")
            .select("*, project:projects(*), task:tasks(*)")
            .eq("user_id", user.id)
            .is("end_time", null)
            .order("start_time", { ascending: false })
            .limit(1)
            .single();

        if (data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setCurrentSession(data as any);
        }
    }, [user]);

    // Fetch today's data when user loads
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line
            fetchTodaySessions();
            // eslint-disable-next-line
            checkActiveSession();
            fetchDailySwitches();
        } else {
            setTotalToday(0);
            setSessionsToday([]);
            setCurrentSession(null);
            setElapsed(0);
            setSwitchCount(0);
        }
        // eslint-disable-next-line
    }, [user]);

    // Real-time ticker
    useEffect(() => {
        if (currentSession?.start_time && !currentSession.end_time) {
            const startTime = new Date(currentSession.start_time).getTime();

            // Update immediately
            // eslint-disable-next-line
            setElapsed(Math.floor((Date.now() - startTime) / 1000));

            // Set interval
            tickerRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            if (tickerRef.current) clearInterval(tickerRef.current);
            setElapsed(0);
        }

        return () => {
            if (tickerRef.current) clearInterval(tickerRef.current);
        };
        // eslint-disable-next-line
    }, [currentSession]);

    const startSession = async (projectId?: string, taskId?: string) => {
        if (!user) return;

        // Prevent multiple sessions
        if (currentSession) return;

        // Calculate initial focus score based on current switches
        // Simple logic: 100 - (switches * 5). Min 0.
        const initialScore = Math.max(0, 100 - (switchCount * 5));

        const { data, error } = await supabase
            .from("sessions")
            .insert({
                user_id: user.id,
                start_time: new Date().toISOString(),
                project_id: projectId || null,
                task_id: taskId || null,
                focus_score: initialScore
            })
            .select("*, project:projects(*), task:tasks(*)")
            .single();

        if (error) {
            console.error("Start Error:", error);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCurrentSession(data as any);
    };

    const stopSession = async () => {
        if (!currentSession || !user) return;

        const endTime = new Date();
        const startTime = new Date(currentSession.start_time);
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        const { error } = await supabase
            .from("sessions")
            .update({
                end_time: endTime.toISOString(),
                duration,
            })
            .eq("id", currentSession.id)
            .select()
            .single();

        if (error) {
            console.error("Stop Error:", error);
            return;
        }

        setCurrentSession(null);
        // Refresh list to include this new session
        fetchTodaySessions();
    };

    const switchContext = async (newProjectId: string | null, newTaskId: string | null) => {
        if (!user || !currentSession) return;

        // 1. Stop current
        await stopSession();

        // 2. Log switch if project changed
        // If simply adding a task to same project, maybe don't penalize? 
        // User requirement: "Switch between different Project IDs"
        if (currentSession.project_id !== newProjectId) {
            await supabase.from("context_switches").insert({
                user_id: user.id,
                session_id: currentSession.id, // Linked to previous session
                from_project_id: currentSession.project_id,
                to_project_id: newProjectId,
            });
            setSwitchCount(prev => prev + 1);
        }

        // 3. Start new session immediately
        // Add small delay to ensure stopSession database write clears or just fire/forget
        setTimeout(() => {
            startSession(newProjectId || undefined, newTaskId || undefined);
        }, 200);
    };

    return {
        currentSession,
        totalToday,
        elapsed,
        sessionsToday,
        switchCount,
        startSession,
        stopSession,
        switchContext
    };
}
