// RBAC -> Role Based Access Control

import { Role } from "@/data/types"

const ROLES = {
    admin: [
        "view:comments",
        "create:comments",
        "update:comments",
        "delete:comments",
    ],
    moderator: [
        "view:comments",
        "create:comments",
        "update:ownComments",
        "delete:comments",
    ],
    user: [
        "view:comments",
        "create:comments",
        "delete:ownComments",
        "update:ownComments"
    ]
} as const

type Permission = (typeof ROLES)[Role][number]

export function hasPermission(user: { id: string, roles: Role[] }, permission: Permission) {
    return user.roles.some(role => {
        return (ROLES[role] as readonly Permission[]).includes(permission)
    })
}
