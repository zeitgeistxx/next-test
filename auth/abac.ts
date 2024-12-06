// ABAC -> Attribute Based Access Control

import { Comment, Role, Todo, User } from "@/data/types"


type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

type Permissions = {
    comments: {
        dataType: Comment
        action: "view" | "create" | "update"
    }
    todos: {
        dataType: Todo
        action: "view" | "create" | "update" | "delete"
    }
}

const ROLES = {
    admin: {
        comments: {
            view: true,
            create: true,
            update: true
        },
        todos: {
            view: true,
            create: true,
            update: true,
            delete: true,
        },
    },
    moderator: {
        comments: {
            view: true,
            create: true,
            update: true,
        },
        todos: {
            view: true,
            create: true,
            update: true,
            delete: (user, todo) => todo.completed
        }
    },
    user: {
        comments: {
            view: (user, comment) => !user.blockedBy.includes(comment.authorId),
            create: true,
            update: (user, comment) => comment.authorId === user.id
        },
        todos: {
            view: (user, todo) => !user.blockedBy.includes(todo.userId),
            create: true,
            update: (user, todo) => todo.userId === user.id || todo.invitedUsers.includes(user.id),
            delete: (user, todo) => (todo.userId === user.id || todo.invitedUsers.includes(user.id)) && todo.completed
        }
    }
} satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    return user.roles.some(role => {
        const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]

        if (permission == null) return false

        if (typeof permission === "boolean") return permission

        return data != null && permission(user, data)
    })
}