import { RSSItem, RSSFeed } from "@/app/types"
import { Prisma, PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache"
import Parser from "rss-parser"

export const parser = new Parser<RSSFeed, RSSItem>()
export const prisma = new PrismaClient()


export const postSelectPreview: Prisma.PostSelect = {
    id: true,
    publishedAt: true,
    snippet: true
}

export const postSelectDisplay: Prisma.PostSelect = {
    id: true,
    publishedAt: true,
    content: true
}


export function getDate(date: Date): string {
    return date.toLocaleDateString("de-DE", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export async function getRSSFeed(url: string): Promise<RSSFeed> {
    const feed = await parser.parseURL(url)
    return feed
}


export async function archiveFeed(feed: RSSFeed) {
    let c = 0
    for (const i of feed.items) {
        const wordpressId = parseInt(i.id.split('=')[1])
        const publishedAt = new Date(i.pubDate)
        const content = i.contentSnippet
        const snippet = content.slice(0, 80).replace(/\s*[.,;()]*\s*[\wäöü]*$/g, '') + '…'

        const post: Prisma.PostCreateInput = {
            wordpressId: wordpressId,
            publishedAt: publishedAt,
            content: content,
            snippet: snippet,
        }

        const res = await createPost(post)
        if (res) c++
    }
    return c
}

async function createPost(post: Prisma.PostCreateInput) {
    try {
        const postCreated = await prisma.post.create({ data: post })
        console.log(`Post ${post.wordpressId} has been archived`)
        // revalidatePath('/post/' + postCreated.id)
        // statically generate the path of the new post
        revalidatePath('/post/' + postCreated.id)
        return 1
    } catch {
        console.log(`Post ${post.wordpressId} is aready archived`)
        return 0
    }
}