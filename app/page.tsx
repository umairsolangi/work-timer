"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTimer } from "@/hooks/useTimer";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Layout } from "@/components/Layout";
import { AuthForm } from "@/components/AuthForm";
import { TimerDisplay } from "@/components/TimerDisplay";
import { SessionList } from "@/components/SessionList";
import { StatsCard } from "@/components/StatsCard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { ContextTaxCard } from "@/components/ContextTaxCard";
import { calculateFocusMetrics } from "@/lib/focusEngine";
import { Loader2, Timer, Watch } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const {
    currentSession,
    totalToday,
    elapsed,
    sessionsToday,
    switchCount,
    startSession,
    stopSession,
    switchContext
  } = useTimer(user);

  // Fetch 7 days for bar chart
  const { stats: weeklyStats, loading: weeklyLoading, refetch: refetchWeekly } = useAnalytics(user, 7);
  // Fetch 90 days for heatmap
  const { stats: activityStats, loading: activityLoading, refetch: refetchActivity } = useAnalytics(user, 90);

  // State for the project selector
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // State for timer mode
  const [timerMode, setTimerMode] = useState<"stopwatch" | "timer">("stopwatch");

  const focusMetrics = calculateFocusMetrics(switchCount);

  const handleStart = () => {
    startSession(selectedProject || undefined, selectedTask || undefined);
  };

  const handleStop = async () => {
    await stopSession();
    // Refetch analytics after stopping a session to show updated graph
    refetchWeekly();
    refetchActivity();
  };

  const handleProjectSelect = (projectId: string | null, taskId: string | null) => {
    setSelectedProject(projectId);
    setSelectedTask(taskId);

    // Context Switching Logic: If timer is running and project changes, trigger hot switch
    if (currentSession && projectId !== currentSession.project_id) {
      switchContext(projectId, taskId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      {!user ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <AuthForm />
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-700">

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <StatsCard totalSeconds={totalToday} />
            </section>
            <section>
              <ContextTaxCard metrics={focusMetrics} />
            </section>
          </div>

          <section className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

            {/* Mode Toggles */}
            {!currentSession && (
              <div className="flex justify-center mb-8">
                <div className="bg-neutral-900 p-1 rounded-xl border border-neutral-800 flex gap-1">
                  <button
                    onClick={() => setTimerMode("stopwatch")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      timerMode === "stopwatch" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    <Watch className="w-4 h-4" />
                    Stopwatch
                  </button>
                  <button
                    onClick={() => setTimerMode("timer")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      timerMode === "timer" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    <Timer className="w-4 h-4" />
                    Focus Mode
                  </button>
                </div>
              </div>
            )}

            {/* Project Context Selector */}
            <div className="mb-8">
              <div className="text-center text-sm text-neutral-500 mb-2">
                {currentSession ? "Switch Context (Hot Switch)" : "What are you working on?"}
              </div>
              <ProjectSelector
                user={user}
                selectedProjectId={selectedProject}
                selectedTaskId={selectedTask}
                onSelect={handleProjectSelect}
              />
            </div>

            {/* If session is active, show context badge */}
            {currentSession && (currentSession.project || currentSession.task) && (
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/80 border border-neutral-700 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {currentSession.project && (
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: currentSession.project.color }}>
                      {currentSession.project.name}
                    </span>
                  )}
                  {currentSession.project && currentSession.task && <span className="text-neutral-600">/</span>}
                  {currentSession.task && (
                    <span className="text-sm text-neutral-300">
                      {currentSession.task.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            <TimerDisplay
              elapsed={elapsed}
              isActive={!!currentSession}
              onStart={handleStart}
              onStop={handleStop}
              mode={timerMode}
              targetDuration={25 * 60} // 25 Minutes Default
            />
          </section>

          <div className="grid grid-cols-1 gap-8">
            <section>
              <ActivityHeatmap stats={activityStats} loading={activityLoading} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section>
                <AnalyticsChart stats={weeklyStats} loading={weeklyLoading} />
              </section>

              <section>
                <SessionList sessions={sessionsToday} />
              </section>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
