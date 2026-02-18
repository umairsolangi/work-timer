import { Activity, Zap } from "lucide-react";

interface StatsCardProps {
    totalSeconds: number;
}

export function StatsCard({ totalSeconds }: StatsCardProps) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    // Calculate efficiency (arbitrary 8h goal for demo)
    const goal = 8 * 3600;
    const percentage = Math.min(Math.round((totalSeconds / goal) * 100), 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-20 h-20" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-indigo-300 font-medium mb-1">Total Time Today</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white tracking-tight">
                            {hours}<span className="text-xl text-neutral-500 font-normal">h</span> {minutes}<span className="text-xl text-neutral-500 font-normal">m</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-neutral-900 border border-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-20 h-20" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-emerald-300 font-medium mb-1">Daily Goal Status</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white tracking-tight">
                            {percentage}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
