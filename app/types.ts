export interface RSSItem {
    title: object,
    id: string,
    link: string,
    pubDate: string,
    isoDate: string,
    author: string,
    content: string,
    contentSnippet: string,
}

export interface RSSFeed {
    title: string,
    link: string,
    feedUrl: string,
    lastBuildDate: string,
    items: RSSItem[],
}