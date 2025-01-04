import { prisma, getDate } from "@/app/lib"
import Form from 'next/form'

export default async function Post({
    searchParams,
}: {
    searchParams: Promise<{ query: string }>
}) {
    let query = (await searchParams).query
    let posts

    if (query) {
        query = query.split(" ").join(" & ")
        posts = await prisma.post.findMany({
            where: {
                content: {
                    search: query
                }
            },
            orderBy: {
                publishedAt: 'desc'
            }
        })
    }


    return (
        <>
            <Form action="/search" className="flex gap-4 items-center mb-24">
                <input name="query" placeholder="Suchbegriff" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 my-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                {posts && <span className="ml-8">{posts.length} results</span>}
            </Form>

            {
                query && posts &&
                posts.map(i => (
                    <article key={i.id}>
                        <a href={`post/${i.id}`} className="font-bold">{getDate(i!.publishedAt)}</a>
                        <p>{i!.snippet}</p><br />
                    </article>
                ))
            }
        </>
    )
}