import { Post } from "@/models/post.model";

export async function generateStaticParams() {
    const res = await fetch('https://api.vercel.app/blog', { cache: 'force-cache' })
    const data: Post[] = await res.json()

    return data.map((post) => ({
        id: post.id.toString()
    }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const slug = (await params).id

    return (
        <div>My Post: {slug}</div>
    )
}

