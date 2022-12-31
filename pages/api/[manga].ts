// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { json } from 'stream/consumers'


const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { manga } = req.query
  const posts = await prisma.category.findMany({
    where: {
      title: manga?.toString()
    },
  })
  console.log(typeof manga);
  res.status(200).json(posts)
}
