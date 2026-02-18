import { DailyStat } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

interface AnalyticsChartProps {
    stats: DailyStat[];
    loading?: boolean;
}

export function AnalyticsChart({ stats, loading }: AnalyticsChartProps) {
    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-neutral-900/30 rounded-3xl border border-neutral-800">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxSeconds = Math.max(...stats.map(s => s.totalSeconds), 3600); // Minimum scale of 1 hour

    const formatHours = (seconds: number) => {
        const h = (seconds / 3600).toFixed(1);
        return parseFloat(h); // Remove trailing .0
    };

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Work Hours
                </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4">
                {stats.map((stat) => {
                    const hours = formatHours(stat.totalSeconds);
                    const heightPercentage = Math.min((stat.totalSeconds / maxSeconds) * 100, 100);

                    return (
                        <div key={stat.date} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full relative flex items-end justify-center h-full">
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {hours} hrs
                                </div>

                                {/* Bar */}
                                <div
                                    className={cn(
                                        "w-full max-w-[2.5rem] bg-indigo-500/20 hover:bg-indigo-500 transition-all duration-300 rounded-t-lg relative group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]",
                                        stat.totalSeconds === 0 && "h-[2px] bg-neutral-800 hover:bg-neutral-700"
                                    )}
                                    style={{ height: stat.totalSeconds > 0 ? `${heightPercentage}%` : '2px' }}
                                >
                                    {/* Inner bar for solid fill effect if desired, or keep translucent */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg opacity-80"
                                        style={{ height: '0%' }} // Animated fill could go here
                                    ></div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors">
                                {stat.dayName}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
