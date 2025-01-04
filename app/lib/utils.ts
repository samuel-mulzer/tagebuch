import { prisma, postSelectPublishedAt } from "@/app/lib/prisma"


export const BASE_URL = process.env.NODE_ENV === "production"
    ? "https://tagebucheineslandpfarrers.vercel.app"
    : "http://localhost:3000"



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


export function processSlug(slug?: string[]) {
    if (slug) {
        const year = parseInt(slug[0])
        const month = parseInt(slug[1])
        return [year, month]
    } else {
        return [null, null]
    }
}