import { NextApiRequest, NextApiResponse } from "next"
// import { getSession } from "next-auth/client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export default async function getPosts(req: NextApiRequest, res: NextApiResponse) {
    // const { data: session} = getSession()
    const query = req.query
    const { input, limit, skip } = req.query  
    const posts = await prisma.post.findMany({
        where: {
            mangaTitle: input?.toString(),
        },
        take: limit ? parseInt(limit.toString()) : 10,
        skip: skip ? parseInt(skip.toString()) : 0,
    })

    if (!posts) {
        
        return res.status(404).json({ message: "No posts found" })
    }
    
    res.status(200).json(posts)
    
}

