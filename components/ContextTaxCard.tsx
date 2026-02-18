import { FocusMetrics } from "@/lib/focusEngine";
import { AlertTriangle, Zap, BrainCircuit } from "lucide-react";

interface ContextTaxCardProps {
    metrics: FocusMetrics;
}

export function ContextTaxCard({ metrics }: ContextTaxCardProps) {
    const { switchCount, taxMinutes, fragmentationScore, status, statusColor } = metrics;

    return (
        <div className="relative overflow-hidden bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md group">
            {/* Neon Glow Border Effect */}
            <div
                className="absolute inset-0 opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: `inset 0 0 20px ${statusColor}`,
                }}
            />

            <div className="relative z-10 flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-white tracking-wide uppercase">Focus Metrics</h3>
                    </div>
                    <div
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                        style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                            borderColor: `${statusColor}40`
                        }}
                    >
                        {status}
                    </div>
                </div>

                {/* Fragmentation Meter */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Fragmentation Score</span>
                        <span className="text-white font-mono">{fragmentationScore}/100</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 ease-out relative"
                            style={{ width: `${fragmentationScore}%`, backgroundColor: statusColor }}
                        >
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-2 text-neutral-500 mb-1 text-xs uppercase">
                            <Zap className="w-3 h-3" />
                            <span>Switches</span>
                        </div>
                        <div className="text-2xl font-mono text-white">{switchCount}</div>
                    </div>

                    <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800 relative overflow-hidden">
                        {taxMinutes > 0 && (
                            <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none" />
                        )}
                        <div className="flex items-center gap-2 text-neutral-500 mb-1 text-xs uppercase relative z-10">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>Context Tax</span>
                        </div>
                        <div className="text-2xl font-mono text-white relative z-10">
                            {taxMinutes}<span className="text-sm text-neutral-500 ml-1">min</span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="text-xs text-neutral-400 italic text-center">
                    {switchCount === 0
                        ? "Perfect flow state. Keep it up!"
                        : `You've switched context ${switchCount} times. ~${taxMinutes}m lost to cognitive load.`
                    }
                </div>

            </div>
        </div>
    );
}
