export interface User {
	id: string;
	email: string;
	name: string;
	password: string;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	assignees: string[];
	tags?: string[];
	columnId: string;
	position: number;
	createdAt: string;
}

export interface Column {
	id: string;
	title: string;
	boardId: string;
	tasks: Task[];
}

export interface Board {
	id: string;
	title: string;
	ownerId: string;
	members: string[];
	columns: Column[];
	createdAt: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
}
