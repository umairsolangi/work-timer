import { DailyStat } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ActivityHeatmapProps {
    stats: DailyStat[];
    loading?: boolean;
}

export function ActivityHeatmap({ stats, loading }: ActivityHeatmapProps) {
    if (loading) {
        return (
            <div className="h-48 flex items-center justify-center bg-neutral-900/30 rounded-3xl border border-neutral-800">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Helper to determine intensity level (0-4)
    const getIntensity = (seconds: number) => {
        const hours = seconds / 3600;
        if (hours === 0) return 0;
        if (hours < 1) return 1;
        if (hours < 3) return 2;
        if (hours < 5) return 3;
        return 4;
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Activity Log</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-neutral-800 border border-neutral-700"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-900/40 border border-indigo-800/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-600/40 border border-indigo-500/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-500 border border-indigo-400"></div>
                        <div className="w-3 h-3 rounded-sm bg-indigo-400 border border-indigo-200 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-end">
                {stats.map((stat) => {
                    const intensity = getIntensity(stat.totalSeconds);

                    return (
                        <div
                            key={stat.date}
                            className="group relative"
                        >
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-sm transition-all duration-300",
                                    intensity === 0 && "bg-neutral-800/50 border border-neutral-800 hover:border-neutral-700",
                                    intensity === 1 && "bg-indigo-900/30 border border-indigo-800/30 hover:bg-indigo-900/50",
                                    intensity === 2 && "bg-indigo-700/40 border border-indigo-600/40 hover:bg-indigo-700/60 shadow-[0_0_5px_rgba(99,102,241,0.2)]",
                                    intensity === 3 && "bg-indigo-500/60 border border-indigo-500/60 hover:bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.4)]",
                                    intensity === 4 && "bg-indigo-400 border border-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.6)] hover:shadow-[0_0_15px_rgba(129,140,248,0.8)] z-10 scale-110"
                                )}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max">
                                <div className="bg-neutral-900 text-xs text-neutral-200 py-1.5 px-3 rounded-lg border border-neutral-800 shadow-xl flex flex-col items-center">
                                    <span className="font-semibold text-white">{formatDuration(stat.totalSeconds)}</span>
                                    <span className="text-[10px] text-neutral-500">{format(new Date(stat.date), 'MMM d, yyyy')}</span>
                                </div>
                                {/* Arrow */}
                                <div className="w-2 h-2 bg-neutral-900 border-r border-b border-neutral-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
