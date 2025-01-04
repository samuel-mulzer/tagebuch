"use client"

import Link from "next/link"
import { getDate, getSnippet } from "@/app/lib/utils"

export function SearchPreview({ id, publishedAt, content, query }: { id: number, publishedAt: Date, content: string, query: string }) {
    const date = getDate(publishedAt)
    let snippet = getSnippet(content, query)
    snippet = snippet.replace(query, `<mark>${query}</mark>`)

    return (
        <article className="mt-2 mb-8 md:mb-4">
            <Link href={`/post/${id}?query=${query}`}>
                <h2 className="font-bold">{date}</h2>
            </Link>
            <p dangerouslySetInnerHTML={{ __html: snippet }}></p>
        </article>
    )
}