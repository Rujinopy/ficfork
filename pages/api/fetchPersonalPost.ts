// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { useSession } from 'next-auth/react';
import session from './session/session';


const prisma = new PrismaClient()

export default async function fetchMyPosts(req: NextApiRequest, res: NextApiResponse) {
    const { input, limit, skip } = req.query
    const { data: session } = useSession();
    const posts = await prisma.post.findMany({
        where: {
            author: {
                email: session?.user?.email
            }
        },
        take: limit ? parseInt(limit.toString()) : 10,
        // skip: skip ? parseInt(skip.toString()) : 0,
    })
}
