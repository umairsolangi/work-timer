import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";

export interface DailyStat {
    date: string; // ISO date string YYYY-MM-DD
    dayName: string; // Mon, Tue, etc.
    totalSeconds: number;
}

export function useAnalytics(user: User | null, rangeDays: number = 7) {
    const [stats, setStats] = useState<DailyStat[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        const today = new Date();
        const start = subDays(today, rangeDays - 1);

        // Generate empty stats for the range
        const days = eachDayOfInterval({ start, end: today });
        const statsMap = new Map<string, number>();

        days.forEach(day => {
            statsMap.set(format(day, 'yyyy-MM-dd'), 0);
        });

        const { data } = await supabase
            .from("sessions")
            .select("start_time, duration")
            .eq("user_id", user.id)
            .gte("start_time", startOfDay(start).toISOString())
            .lte("start_time", endOfDay(today).toISOString())
            .not("duration", "is", null);

        if (data) {
            data.forEach((session: { start_time: string; duration: number }) => {
                const dateKey = format(new Date(session.start_time), 'yyyy-MM-dd');
                const currentTotal = statsMap.get(dateKey) || 0;
                statsMap.set(dateKey, currentTotal + (session.duration || 0));
            });
        }

        const formattedStats: DailyStat[] = Array.from(statsMap.entries()).map(([date, totalSeconds]) => ({
            date,
            dayName: format(new Date(date), 'EEE'),
            totalSeconds,
        }));

        setStats(formattedStats);
        setLoading(false);
    }, [user, rangeDays]);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line
            fetchStats();
        }
    }, [user, fetchStats]);

    return { stats, loading, refetch: fetchStats };
}
