import { getRSSFeed, archiveFeed } from "@/app/lib"
import { revalidatePath } from "next/cache"


export async function GET() {
    let i = 0
    let c = 0
    while (true) {
        const url = "https://tagebucheineslandpfarrers.wordpress.com/feed/atom?paged=" + i
        try {
            const feed = await getRSSFeed(url)
            c += await archiveFeed(feed)
        } catch {
            break
        }
        i++
    }

    if (c > 0) {
        revalidatePath('/')
    }


    return Response.json({
        'message': 'success',
        'timestamp': Date.now(),
        'scanned pages': i,
        'archived posts': c
    })
}