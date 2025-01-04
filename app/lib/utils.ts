import { prisma, postSelectPublishedAt } from "@/app/lib/prisma"

export function getDate(date: Date): string {
    return date.toLocaleDateString("de-DE", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Europe/Berlin'
    })
}



export function getFirstPublicationDate() {
    return new Date(process.env.ARCHIVE_START_DATE || "2024-07-01")
}


export async function getLatestPublicationDate() {
    const latestPost = await prisma.post.findFirst({
        orderBy: {
            publishedAt: "desc"
        },
        select: postSelectPublishedAt
    })
    return latestPost?.publishedAt || new Date()
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
        snippet = content.substring(0, maxLength)

        // Remove any partial word at the end
        snippet = snippet.replace(/\s+\S*$/, '')
        // Check if the last character is not a sentence-ending punctuation mark and add ellipsis if necessary
        if (!/[.?!]$/.test(snippet)) snippet += '...'
    }
    return snippet
}