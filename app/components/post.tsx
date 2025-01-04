'use client'

import { useSearchParams } from "next/navigation"
import { getDate } from "@/app/lib/utils"


export function Post({ publishedAt, content }: { publishedAt: Date, content: string }) {
    const date = getDate(publishedAt)

    return (
        <article>
            <h2 className="font-bold pb-4">{date}</h2>
            <PostContent content={content} />
        </article>
    )
}

function PostContent({ content }: { content: string }) {
    const searchParams = useSearchParams()
    const query = searchParams.get("query")

    if (query) {
        content = content.replace(query, `<mark>${query}</mark>`)
    }

    return (
        <>
            {
                query ? (
                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: content }}></p>
                ) : (
                    <p className="text-lg">{content}</p>
                )
            }
        </>
    )
}