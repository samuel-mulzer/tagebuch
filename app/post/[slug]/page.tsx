import { prisma, getDate, postSelectDisplay } from "@/app/lib";

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        orderBy: {
            publishedAt: 'desc'
        },
        take: 100,
        select: postSelectDisplay
    })

    return posts.map(post => ({
        slug: post.id,
    }))
}

export default async function Post({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    const post = await prisma.post.findUnique({
        where: {
            id: slug
        }
    })
    return (
        <>
            <h2 className="text-xl font-bold pb-4">{getDate(post!.publishedAt)}</h2>
            <p className="text-base">{post!.content}</p>
        </>
    )
}