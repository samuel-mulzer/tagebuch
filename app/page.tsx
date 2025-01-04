import { prisma, postSelectPreview } from "@/app/lib/prisma"
import { Preview } from "@/app/components/preview"

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      publishedAt: "desc"
    },
    select: postSelectPreview,
    take: 10
  })

  return (
    <div className="container mx-auto">
      <section>
        <p>
          Ulrich Fentzloff, 1953 in Ludwigsburg geboren und aufgewachsen.
          Kind poetisch verklärter Tage in einem Württemberg des Geistes.
          Studium der Evang. Theologie und der Philosophie an der Universität Tübingen.
          Vikar in Leonberg-Silberberg.
          Pfarrverweser in Unterlenningen, am Fuße der Schwäbischen Alb.
          Gemeindepfarrer in Kirchberg/ Jagst (Hohenlohe), an der Johanneskirche in Stuttgart,
          und schließlich, 25 Jahre lang, bis Sommer 2016, in Langenargen am Bodensee.
          Lebt als Dichter und Privatgelehrter in Konstanz.
        </p>
        <p className="mt-8">
          <em>
            Absichtlich deckt den Ausgang des Tages zu,<br />
            Umnachtet das Zukünftige uns der Gott<br />
            Und lacht, wenn sterblich eins zu sehr be-<br />
            Sorgt, was geschehen wird.<br />
          </em>
          <br />
          (Horaz, in der Übersetzung Friedrich Hölderlins)
        </p>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold pb-4">Aktuelle Einträge</h2>
        {
          posts.map(i => (
            <Preview key={i.id} id={i.wordpressId} publishedAt={i.publishedAt} snippet={i.snippet} />
          ))
        }
      </section>
    </div>
  )
}
