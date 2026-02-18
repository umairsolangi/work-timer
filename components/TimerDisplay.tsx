import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
    elapsed: number;
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
    mode: "stopwatch" | "timer";
    targetDuration?: number; // In seconds, e.g., 1500 for 25m
}

export function TimerDisplay({ elapsed, isActive, onStart, onStop, mode, targetDuration = 1500 }: TimerDisplayProps) {

    const displayTime = mode === "stopwatch"
        ? elapsed
        : Math.max(0, targetDuration - elapsed);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        // Always show MM:SS
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');

        if (h > 0) {
            return `${h}:${mStr}:${sStr}`;
        }
        return `${mStr}:${sStr}`;
    };

    const progress = mode === "timer"
        ? Math.min((elapsed / targetDuration) * 100, 100)
        : 0;

    return (
        <div className="flex flex-col items-center justify-center py-12 relative">

            {/* Circular Progress Background for Timer Mode (Optional Visual Flair) */}
            {mode === "timer" && isActive && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    {/* Placeholder for a circular progress if we wanted one */}
                </div>
            )}

            <div className={cn(
                "text-7xl sm:text-9xl font-bold font-mono tracking-tighter transition-all duration-500 relative z-10",
                isActive ? "text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]" : "text-neutral-700",
                mode === "timer" && displayTime === 0 && "text-emerald-400 animate-pulse"
            )}>
                {formatTime(displayTime)}
            </div>

            {mode === "timer" && isActive && (
                <div className="w-64 h-1 bg-neutral-800 rounded-full mt-8 overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${100 - progress}%` }}
                    />
                </div>
            )}

            <div className="flex items-center gap-4 mt-8">
                {!isActive ? (
                    <button
                        onClick={onStart}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-indigo-400 blur opacity-0 group-hover:opacity-30 transition-opacity" />
                        <Play className="w-6 h-6 fill-current relative z-10" />
                        <span className="text-lg font-bold tracking-wide relative z-10">Start Session</span>
                    </button>
                ) : (
                    <button
                        onClick={onStop}
                        className="group flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/20"
                    >
                        <Square className="w-6 h-6 fill-current" />
                        <span className="text-lg font-bold tracking-wide">Stop Session</span>
                    </button>
                )}
            </div>
        </div>
    );
}
