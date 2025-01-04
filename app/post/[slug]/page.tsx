import { getDate } from "@/app/lib/utils"
import { prisma, postSelectDisplay, postSelectId, postSelectPublishedAt } from "@/app/lib/prisma"
import { Post } from "@/app/components/post"
import { redirect } from "next/navigation"

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        orderBy: {
            publishedAt: "desc"
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

    if (post === null) {
        return {
            title: "404"
        }
    }
    return {
        title: "Eintrag am " + getDate(post.publishedAt)
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