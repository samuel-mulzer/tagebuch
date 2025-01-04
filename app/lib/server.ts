import { Prisma } from "@prisma/client"
import Parser from "rss-parser"
import { revalidatePath } from "next/cache"

import { prisma, PrismaError } from "@/app/lib/prisma"

import { RSSItem, RSSFeed } from "@/app/types"
import { getSnippet } from "@/app/lib/utils"



export const parser = new Parser<RSSFeed, RSSItem>()

export async function getRSSFeed(url: string): Promise<RSSFeed> {
    return await parser.parseURL(url)
}


export async function archiveFeed(feed: RSSFeed) {
    let c = 0
    for (const i of feed.items) {
        const wordpressId = parseInt(i.id.split("=")[1])
        const publishedAt = new Date(i.pubDate)
        const content = i.contentSnippet
        const snippet = getSnippet(content)

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
        revalidatePath('/post/' + postCreated.id)
        return 1
    } catch(e: unknown) {
        const error = e as PrismaError
        if (error.code == "P2002") {
            console.log(`Post ${post.wordpressId} is aready archived`)
        }  else {
            console.error(e)
        }
        return 0
    }
}