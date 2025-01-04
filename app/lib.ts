import { RSSItem, RSSFeed } from "@/app/types"
import { Prisma, PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache"
import Parser from "rss-parser"

export const parser = new Parser<RSSFeed, RSSItem>()


declare global {
    var prisma: PrismaClient //eslint-disable-line no-var
}

export let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}



export function getDate(date: Date): string {
    return date.toLocaleDateString("de-DE", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Europe/Berlin'
    })
}


export function getSnippet(content: string, query: string = ""): string {
    let snippet
    const maxLength = 80
    const halfLength = Math.floor(maxLength / 2)

    if (query) {
        if (content.length <= maxLength) return content
        const queryIndex = content.indexOf(query)

        // If query not found, return a normal truncated snippet
        if (queryIndex === -1) return getSnippet(content)
        let start = Math.max(0, queryIndex - halfLength)
        let end = Math.min(start + maxLength, content.length)

        // Ensure we don't cut a word at the start
        if (start > 0) {
            start = content.indexOf(' ', start) + 1 || start
        }

        // Ensure we don't cut a word at the end
        if (end < content.length) {
            end = content.lastIndexOf(' ', end) || end;
        }

        snippet = content.substring(start, end).trim()

        // Add ellipses if needed
        if (start > 0) snippet = '... ' + snippet
        if (end < content.length) snippet = snippet + '...'

    } else {
        if (content.length <= maxLength) return content
        snippet = content.substr(0, maxLength)

        // Remove any partial word at the end
        snippet = snippet.replace(/\s+\S*$/, '')
        // Check if the last character is not a sentence-ending punctuation mark and add ellipsis if necessary
        if (!/[.?!]$/.test(snippet)) snippet += '...'
    }
    return snippet
}


export function processSlug(slug: string[]) {
    if (slug) {
        const year = parseInt(slug[0])
        const month = parseInt(slug[1])
        return [year, month]
    } else {
        return [null, null]
    }
}




export const postSelectDisplay = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    publishedAt: true,
    content: true
})

export const postSelectPreview = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true,
    publishedAt: true,
    snippet: true
})

export const postSelectSearch = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true,
    publishedAt: true,
    content: true
})


export const postSelectId = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true
})

export const postSelectPublishedAt = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    publishedAt: true
})




export function getFirstPublicationDate() {
    return new Date(process.env.ARCHIVE_START_DATE || "2024-07-01")
}

export async function getLatestPublicationDate() {
    const latestPost = await prisma.post.findFirst({
        orderBy: {
            publishedAt: 'desc'
        },
        select: postSelectPublishedAt
    })
    return latestPost?.publishedAt || new Date()
}




export async function getRSSFeed(url: string): Promise<RSSFeed> {
    return await parser.parseURL(url)
}


export async function archiveFeed(feed: RSSFeed) {
    let c = 0
    for (const i of feed.items) {
        const wordpressId = parseInt(i.id.split('=')[1])
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
    } catch {
        console.log(`Post ${post.wordpressId} is aready archived`)
        return 0
    }
}