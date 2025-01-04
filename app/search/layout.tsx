import Form from "next/form"

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Form action="/search" className="flex flex-col">
                <div className="flex flex-row gap-4 items-center flex-wrap">
                    <input name="query" placeholder="Suchbegriff" className="w-48 md:w-64 p-2.5 my-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <button type="submit" className="px-5 py-2.5 text-base text-white font-medium text-center rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">→</button>
                </div>
            </Form>

            {children}
        </>
    )
}