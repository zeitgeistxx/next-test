import { Role } from "./types";

export { }

declare global {
    interface CustomJwtSessionClaims {
        roles: Role[]
    }
}