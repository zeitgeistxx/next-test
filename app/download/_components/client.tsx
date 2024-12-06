'use client'

export default function Client({ children }: Readonly<{ children: React.ReactNode }>) {
    console.log("client rendered")

    return (
        <>
            <p>This is client component</p>
            {children}
        </>
    )
}
