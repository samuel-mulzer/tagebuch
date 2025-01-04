import { revalidatePath } from "next/cache"

export async function GET() {
    revalidatePath('/')
    return Response.json({
        'message': 'revalidated start page',
        'timestamp': Date.now()
    })
}