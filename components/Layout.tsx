import { ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { LogOut, Clock, User as UserIcon } from "lucide-react";

interface LayoutProps {
    children: ReactNode;
    user: User | null;
    onLogout: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            WorkTimer
                        </h1>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800/50 px-3 py-1.5 rounded-full border border-neutral-800">
                                <UserIcon className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{user.email}</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors duration-200"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 py-8 mt-auto">
                <div className="max-w-5xl mx-auto px-6 text-center text-xs text-neutral-500">
                    &copy; {new Date().getFullYear()} WorkTimer. Professional Time Tracking by Umair Solangi.
                </div>
            </footer>
        </div>
    );
}
