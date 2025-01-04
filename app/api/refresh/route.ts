import { getRSSFeed, archiveFeed } from "@/app/lib/server"
import { getLatestPublicationDate } from "@/app/lib/utils"
import { revalidatePath } from "next/cache"

export async function GET() {
    let c = 0
    const url = "https://tagebucheineslandpfarrers.wordpress.com/feed/atom"
    const feed = await getRSSFeed(url)

    const lastUpdated = new Date(feed.lastBuildDate)
    const lastArchived = await getLatestPublicationDate()

    // console.log(lastUpdated.toLocaleString(), lastArchived.toLocaleString(), lastUpdated > lastArchived)

    if (lastUpdated > lastArchived) {
        c = await archiveFeed(feed)
    } else {
        console.log(new Date().toLocaleString() + ": No new posts available")
    }

    if (c > 0) {
        const year = lastUpdated.getFullYear().toString()
        const month = (lastUpdated.getMonth() + 1).toString()
        revalidatePath('/')
        revalidatePath(`/timeline/${year}`)
        revalidatePath(`/timeline/${year}/${month}`)
    }

    return Response.json({
        'message': c > 1 ? `Archived ${c} new posts` : c == 1 ? 'Archived 1 new post' : 'No new posts available',
        'archived posts': c,
        'timestamp': Date.now()
    })
}
