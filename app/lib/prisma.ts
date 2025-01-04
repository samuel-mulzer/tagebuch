import { Prisma, PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
    //eslint-disable-next-line no-var
    var prisma: PrismaClient
}

export let prisma: PrismaClient

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({ adapter })
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({ adapter })
    }
    prisma = global.prisma
}

export interface PrismaError extends Error {
    code: string
}

export const postSelectDisplay = {
    id: true,
    publishedAt: true,
    content: true
} satisfies Prisma.PostSelect

export const postSelectPreview = {
    id: true,
    wordpressId: true,
    publishedAt: true,
    snippet: true
} satisfies Prisma.PostSelect

export const postSelectSearch = {
    id: true,
    wordpressId: true,
    publishedAt: true,
    content: true
} satisfies Prisma.PostSelect


export const postSelectId = {
    id: true,
    wordpressId: true
} satisfies Prisma.PostSelect

export const postSelectPublishedAt = {
    id: true,
    publishedAt: true
} satisfies Prisma.PostSelect