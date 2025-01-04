import { prisma, getRSSFeed, archiveFeed } from "@/app/lib"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

const postSelect: Prisma.PostSelect = {
    id: true,
    publishedAt: true
}

export async function GET() {
    let c = 0
    const url = "https://tagebucheineslandpfarrers.wordpress.com/feed/atom"
    const feed = await getRSSFeed(url)
    const lastUpdated = new Date(feed.lastBuildDate)

    const latestPost = await prisma.post.findFirst({
        orderBy: {
            publishedAt: 'desc'
        },
        select: postSelect
    })

    const lastArchived = latestPost!.publishedAt

    if (lastUpdated > lastArchived) {
        c = await archiveFeed(feed)
    }
    
    if (c > 0) {
        revalidatePath('/')
    }

    return Response.json({
        'message': c > 0 ? `Archived ${c} new posts` : 'No new posts available',
        'archived posts': c,
        'timestamp': Date.now()
    })
}
