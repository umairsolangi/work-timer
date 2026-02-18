import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Task, User } from "@/types";

export function useTasks(user: User | null, projectId: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        if (!user || !projectId) return;
        setLoading(true);
        const { data } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .eq("project_id", projectId)
            .order("name");

        if (data) setTasks(data);
        setLoading(false);
    }, [user, projectId]);

    useEffect(() => {
        if (user && projectId) {
            // eslint-disable-next-line
            fetchTasks();
        } else {
            setTasks([]);
        }
        // eslint-disable-next-line
    }, [user, projectId]);

    const createTask = async (name: string) => {
        if (!user || !projectId) return null;

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                user_id: user.id,
                project_id: projectId,
                name,
                status: "todo",
            })
            .select()
            .single();

        if (error) {
            console.error("Create Task Error:", error);
            return null;
        }

        setTasks((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        return data;
    };

    return { tasks, loading, createTask, fetchTasks };
}
