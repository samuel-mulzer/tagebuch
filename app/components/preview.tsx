import Link from "next/link"
import { getDate } from "@/app/lib/utils"

export function Preview({ id, publishedAt, snippet }: { id: number, publishedAt: Date, snippet: string }) {
    const date = getDate(publishedAt)

    return (
        <article className="mt-2 mb-8 md:mb-4">
            <Link href={`/post/${id}`} className="pb-4">
                <h2 className="font-bold">{date}</h2>
            </Link>
            <p>{snippet}</p>
        </article>
    )
}