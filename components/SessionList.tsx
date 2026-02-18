import { Session } from "@/types";
import { Folder, CheckSquare, Clock, History } from "lucide-react";
import { format } from "date-fns";

interface SessionListProps {
    sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);

        return parts.join(" ");
    };

    if (sessions.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500 border border-neutral-800 rounded-xl bg-neutral-900/30 border-dashed">
                <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No sessions recorded today</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-400 mb-4 px-2">
                <History className="w-4 h-4" />
                <h3 className="text-sm font-medium uppercase tracking-wider">Today&apos;s History</h3>
            </div>

            <div className="space-y-2">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors group"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-neutral-200">
                                        {format(new Date(session.start_time), "h:mm a")}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {session.end_time ? format(new Date(session.end_time), "h:mm a") : "Ongoing"}
                                    </div>
                                </div>
                            </div>

                            {/* Project/Task Badges */}
                            {(session.project || session.task) && (
                                <div className="flex items-center gap-2 mt-1 ml-12">
                                    {session.project && (
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                                            style={{ backgroundColor: `${session.project.color}20`, color: session.project.color }}
                                        >
                                            <Folder className="w-3 h-3" />
                                            {session.project.name}
                                        </span>
                                    )}
                                    {session.task && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px]">
                                            <CheckSquare className="w-3 h-3" />
                                            {session.task.name}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-bold text-neutral-200 tabular-nums">
                                {session.duration ? formatDuration(session.duration) : "--"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
