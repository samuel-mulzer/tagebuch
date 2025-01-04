import { prisma, postSelectDisplay, postSelectPublishedAt, postSelectId, getDate } from "@/app/lib";
import { Post } from "@/app/components/post";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        orderBy: {
            publishedAt: 'desc'
        },
        take: 100,
        select: postSelectId
    })

    return posts.map(post => ({
        slug: post.wordpressId.toString()
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug
    const post = await prisma.post.findUnique({
        where: {
            wordpressId: parseInt(slug)
        },
        select: postSelectPublishedAt
    })
    return {
        title: "Eintrag am " + getDate(post!.publishedAt)
    }
}


export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug

    const post = await prisma.post.findUnique({
        where: {
            wordpressId: parseInt(slug)
        },
        select: postSelectDisplay
    })

    if (post === null) {
        redirect('/404')
    }

    return (
        <Post publishedAt={post.publishedAt} content={post.content} />
    )
}