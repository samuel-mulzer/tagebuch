import {prisma, postSelectSearch} from "@/app/lib/prisma"
import { SearchPreview } from "@/app/components/searchPreview"


export default async function Search({
    searchParams,
}: {
    searchParams: Promise<{ query: string }>
}) {
    const query = (await searchParams).query
    let posts
    let n = 0

    if (query) {
        const prisma_query = query.trim().replace(/[\s\n\t]/g, '_')

        posts = await prisma.post.findMany({
            where: {
                content: {
                    search: prisma_query
                }
            },
            orderBy: {
                publishedAt: "desc"
            },
            select: postSelectSearch
        })

        posts = posts.filter(p => {
            const regex = new RegExp(query, 'g')
            if (regex.test(p.content)) {
                return p
            }
        })

        n = posts.length
    }

    return (
        <>
            {
                query && n > 0 ? (
                    <>
                        <span className="block mb-20">({n + " " + (n != 1 ? "Ergebnisse" : "Ergebnis")})</span>
                        <section>
                            <h2 className="text-2xl font-bold pb-4">Gefundene Einträge</h2>
                            {
                                posts && posts.map(i => (
                                    <SearchPreview key={i.id} id={i.wordpressId} publishedAt={i.publishedAt} content={i.content} query={query} />
                                ))
                            }
                        </section>
                    </>
                ) : query && n == 0 ? (
                    <p>Keine Beiträge gefunden</p>
                ) : null
            }
        </>
    )
}