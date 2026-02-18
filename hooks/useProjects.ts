import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Project, User } from "@/types";

export function useProjects(user: User | null) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("name");

        if (data) setProjects(data);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line
            fetchProjects();
        } else {
            setProjects([]);
        }
        // eslint-disable-next-line
    }, [user]);

    const createProject = async (name: string, color: string) => {
        if (!user) return null;

        const { data, error } = await supabase
            .from("projects")
            .insert({
                user_id: user.id,
                name,
                color,
            })
            .select()
            .single();

        if (error) {
            console.error("Create Project Error:", error);
            return null;
        }

        setProjects((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        return data;
    };

    return { projects, loading, createProject, fetchProjects };
}
