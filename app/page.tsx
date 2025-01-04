import { prisma, getDate, postSelectPreview } from './lib'

export default async function Home() {


  const posts = await prisma.post.findMany({
    orderBy: {
      publishedAt: 'desc'
    },
    select: postSelectPreview
  })

  return (
    <div className="container mx-auto">
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
      <p className="mt-8 mb-24">
        <em>
          Absichtlich deckt den Ausgang des Tages zu,<br />
          Umnachtet das Zukünftige uns der Gott<br />
          Und lacht, wenn sterblich eins zu sehr be-<br />
          Sorgt, was geschehen wird.<br />
        </em>
        (Horaz, in der Übersetzung Friedrich Hölderlins)
      </p>
      {
        posts.map(i => (
          <article key={i.id}>
            <a href={`post/${i.id}`} className="font-bold">{getDate(i!.publishedAt)}</a>
            <p>{i.snippet}</p><br />
          </article>
        ))
      }
    </div>
  )
}
