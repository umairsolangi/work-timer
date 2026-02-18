import { useState, useRef, useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { User } from "@/types";
import { Folder, CheckSquare, Plus, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectSelectorProps {
    user: User | null;
    onSelect: (projectId: string | null, taskId: string | null) => void;
    selectedProjectId: string | null;
    selectedTaskId: string | null;
    disabled?: boolean;
}

export function ProjectSelector({ user, onSelect, selectedProjectId, selectedTaskId, disabled }: ProjectSelectorProps) {
    const { projects, loading: projectsLoading, createProject } = useProjects(user);
    const { tasks, loading: tasksLoading, createTask } = useTasks(user, selectedProjectId);

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"select" | "createProject" | "createTask">("select");
    const [newItemName, setNewItemName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setMode("select");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const selectedTask = tasks.find(t => t.id === selectedTaskId);

    const handleCreateProject = async () => {
        if (!newItemName.trim()) return;
        // Random color for now
        const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newProject = await createProject(newItemName, randomColor);
        if (newProject) {
            onSelect(newProject.id, null);
            setMode("select");
            setNewItemName("");
        }
    };

    const handleCreateTask = async () => {
        if (!newItemName.trim() || !selectedProjectId) return;
        const newTask = await createTask(newItemName);
        if (newTask) {
            onSelect(selectedProjectId, newTask.id);
            setMode("select");
            setNewItemName("");
            setIsOpen(false);
        }
    };

    if (!user) return null;

    return (
        <div className="relative max-w-xl mx-auto mb-8" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    isOpen ? "bg-neutral-800 border-indigo-500/50 ring-1 ring-indigo-500/50" : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        selectedProject ? "bg-opacity-20 text-white" : "bg-neutral-800 text-neutral-500"
                    )} style={{ backgroundColor: selectedProject ? `${selectedProject.color}20` : undefined, color: selectedProject?.color }}>
                        <Folder className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className={cn("text-sm font-medium truncate", selectedProject ? "text-white" : "text-neutral-400")}>
                            {selectedProject?.name || "Select Project"}
                        </span>
                        {selectedProject && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <CheckSquare className="w-3 h-3" />
                                <span className="truncate">{selectedTask?.name || "No specific task"}</span>
                            </div>
                        )}
                    </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-neutral-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    {/* Creation Forms */}
                    {mode === "createProject" && (
                        <div className="p-3 border-b border-neutral-800 bg-neutral-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setMode("select")} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
                                <span className="text-xs font-medium text-neutral-300">New Project</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    autoFocus
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    placeholder="Project Name..."
                                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                                    onKeyDown={e => e.key === "Enter" && handleCreateProject()}
                                />
                                <button onClick={handleCreateProject} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-500">Add</button>
                            </div>
                        </div>
                    )}

                    {mode === "createTask" && (
                        <div className="p-3 border-b border-neutral-800 bg-neutral-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setMode("select")} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
                                <span className="text-xs font-medium text-neutral-300">New Task for <span style={{ color: selectedProject?.color }}>{selectedProject?.name}</span></span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    autoFocus
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    placeholder="Task Name..."
                                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                                    onKeyDown={e => e.key === "Enter" && handleCreateTask()}
                                />
                                <button onClick={handleCreateTask} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-500">Add</button>
                            </div>
                        </div>
                    )}

                    {/* Project List */}
                    <div className="max-h-64 overflow-y-auto">
                        {mode === "select" && (
                            <>
                                <div className="p-2">
                                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1 flex justify-between items-center">
                                        Projects
                                        <button onClick={() => { setMode("createProject"); setNewItemName(""); }} className="text-indigo-400 hover:text-indigo-300"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    {projectsLoading ? (
                                        <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-neutral-600" /></div>
                                    ) : projects.length === 0 ? (
                                        <div className="text-center p-4 text-sm text-neutral-600">No projects yet</div>
                                    ) : (
                                        <div className="space-y-1">
                                            {projects.map(project => (
                                                <div key={project.id}>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedProjectId === project.id) {
                                                                // Deselect if already selected
                                                                onSelect(null, null);
                                                            } else {
                                                                onSelect(project.id, null);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                                                            selectedProjectId === project.id ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                                                        )}
                                                    >
                                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                                                        <span className="flex-1">{project.name}</span>
                                                        {selectedProjectId === project.id && <CheckSquare className="w-4 h-4 text-indigo-500" />}
                                                    </button>

                                                    {/* Task List (Nested) */}
                                                    {selectedProjectId === project.id && (
                                                        <div className="ml-4 pl-4 border-l border-neutral-800 mt-1 mb-2 space-y-1">
                                                            <div className="flex justify-between items-center px-2 py-1">
                                                                <span className="text-[10px] text-neutral-500 uppercase">Tasks</span>
                                                                <button onClick={(e) => { e.stopPropagation(); setMode("createTask"); setNewItemName(""); }} className="text-indigo-400 hover:text-indigo-300"><Plus className="w-3 h-3" /></button>
                                                            </div>
                                                            {tasksLoading ? (
                                                                <div className="px-3 py-1 text-xs text-neutral-600">Loading tasks...</div>
                                                            ) : tasks.length === 0 ? (
                                                                <div className="px-3 py-1 text-xs text-neutral-600 italic">No tasks created</div>
                                                            ) : (
                                                                tasks.map(task => (
                                                                    <button
                                                                        key={task.id}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onSelect(project.id, task.id);
                                                                            setIsOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors text-left",
                                                                            selectedTaskId === task.id ? "bg-indigo-500/10 text-indigo-300" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                                                                        )}
                                                                    >
                                                                        <div className={cn("w-1.5 h-1.5 rounded-sm border border-current", selectedTaskId === task.id ? "bg-current" : "")} />
                                                                        <span className="truncate">{task.name}</span>
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
