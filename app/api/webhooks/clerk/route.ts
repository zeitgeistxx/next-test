import { clerkClient, WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { Webhook } from "svix"

export async function POST(req: Request) {
    const headerPaylaod = await headers()
    const svixId = headerPaylaod.get("svix-id")
    const svixTimestamp = headerPaylaod.get("svix-timestamp")
    const svixSignature = headerPaylaod.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response("Error occurred -- no svix header", {
            status: 400
        })
    }

    const paylaod = await req.json()
    const body = JSON.stringify(paylaod)

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature
        }) as WebhookEvent
    }
    catch {
        return new Response("Error occurred", {
            status: 400
        })
    }

    const clerk = await clerkClient()
    switch (event.type) {
        case "user.created": {
            await clerk.users.updateUser(event.data.id, {
                publicMetadata: {
                    roles: ["user"]
                },
                
            })
            break
        }
        default: break;
    }

    return new Response("", { status: 200 })
}
