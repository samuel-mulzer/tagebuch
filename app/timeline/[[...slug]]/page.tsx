import { Preview } from "@/app/components/preview"
import { processSlug, getFirstPublicationDate } from "@/app/lib/utils"
import { prisma, postSelectPreview } from "@/app/lib/prisma"

export async function generateStaticParams() {
    const slugs = []
    const firstPublicationDate = getFirstPublicationDate()

    // generate root slug
    slugs.push([])

    // generate slugs for years
    let date = new Date()
    while (true) {
        if (date < firstPublicationDate) break
        const year = date.getFullYear().toString()
        slugs.push([year])
        date.setFullYear(date.getFullYear() - 1)
    }

    // generate slugs for years and months
    date = new Date()
    for (let i = 0; i <= 12; i++) {
        if (date < firstPublicationDate) break
        const year = date.getFullYear().toString()
        const month = (date.getMonth() + 1).toString()
        slugs.push([year, month])
        date.setMonth(date.getMonth() - 1)
    }

    return slugs.map(slug => ({
        slug: slug
    }))
}

export default async function TimelinePage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const slug = (await params).slug || []
    const [year, month] = processSlug(slug)

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    let posts
    let n = 0
    if (year && month) {
        const startDate = new Date(year, month - 1)
        startDate.setHours(startDate.getHours() - 1)
        const endDate = new Date(year, month)
        endDate.setHours(endDate.getHours() - 1)

        posts = await prisma.post.findMany({
            where: {
                publishedAt: {
                    gte: startDate,
                    lt: endDate
                }
            },
            select: postSelectPreview,
            orderBy: {
                publishedAt: "asc"
            }
        })
        n = posts.length
    }

    return (
        <>
            {
                year && month && n > 0 ? (
                    <section>
                        <h2 className="text-2xl font-bold pb-4">Einträge im {monthNames[month - 1]} {year}</h2>
                        {
                            posts && posts.map(i => (
                                <Preview key={i.id} id={i.wordpressId} publishedAt={i.publishedAt} snippet={i.snippet} />
                            ))
                        }
                    </section>
                ) : year && month && n == 0 ? (
                    <p>Keine Beiträge gefunden</p>
                ) : null
            }
        </>
    )
}