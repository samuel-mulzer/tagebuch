import { Prisma, PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient //eslint-disable-line no-var
}

export let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

export interface PrismaError extends Error {
    code: string
}

export const postSelectDisplay = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    publishedAt: true,
    content: true
})

export const postSelectPreview = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true,
    publishedAt: true,
    snippet: true
})

export const postSelectSearch = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true,
    publishedAt: true,
    content: true
})


export const postSelectId = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    wordpressId: true
})

export const postSelectPublishedAt = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    publishedAt: true
})