export type Comment = {
    id: string;
    body: string;
    authorId: string;
    createdAt: string;
}

export type Todo = {
    id: string;
    title: string;
    userId: string;
    completed: boolean;
    invitedUsers: string[];
}

export type Role = "admin" | "moderator" | "user"
export type User = { blockedBy: string[]; roles: Role[]; id: string; }