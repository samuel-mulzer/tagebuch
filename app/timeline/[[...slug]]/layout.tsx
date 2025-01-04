import { processSlug, getFirstPublicationDate, getLatestPublicationDate } from "@/app/lib/utils"
import Link from "next/link"

export default async function TimlineLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug?: string[] }> }) {
    const slug = (await params).slug
    const [year, month] = processSlug(slug)

    const firstPublicationDate = getFirstPublicationDate()
    const latestPublicationDate = await getLatestPublicationDate()

    const fy = firstPublicationDate.getFullYear()
    const fm = firstPublicationDate.getMonth() + 1
    const ly = latestPublicationDate.getFullYear()
    const lm = latestPublicationDate.getMonth() + 1

    const years = [...Array(ly - fy + 1).keys()].map(i => fy + i)
    const months = years.map(y => [...Array(y == fy ? 12 - fm + 1 : y == ly ? lm : 12).keys()].map(m => m + (y == fy ? fm : 1)))

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    return (
        <>
            <nav className="flex flex-col gap-4 md:gap-2 h-40 font-bold">
                <div className="flex gap-6 flex-nowrap">
                    {
                        years.map(y => (
                            <Link key={y} href={`/timeline/${y}`} className={`${y == year ? "text-black dark:text-white" : "text-gray-400"}`}>{y}</Link>
                        ))
                    }
                </div>
                {
                    year && <div className="flex gap-x-6 flex-wrap">
                        {
                            months[year - fy].map(m => (
                                <Link key={m} href={`/timeline/${year}/${m}`} className={`${m == month ? "text-black dark:text-white" : "text-gray-400"}`}>{monthNames[m - 1]}</Link>
                            ))
                        }
                    </div>
                }
            </nav>

            {children}
        </>
    )
}