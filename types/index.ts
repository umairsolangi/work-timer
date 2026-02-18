export interface User {
    id: string;
    email?: string;
}

export interface Project {
    id: string;
    name: string;
    color: string;
    user_id: string;
}

export interface Task {
    id: string;
    name: string;
    project_id: string;
    status: 'todo' | 'in_progress' | 'done';
    user_id: string;
}

export interface Session {
    id: string;
    user_id: string;
    start_time: string;
    end_time?: string;
    duration?: number;
    project_id?: string;
    task_id?: string;
    project?: Project;
    task?: Task;
}
