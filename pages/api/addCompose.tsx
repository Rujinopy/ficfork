import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { method } from "lodash";

export default async function addPost(req: NextApiRequest, res: NextApiResponse) {
  const { topic, content, short, manga, id} = req.body;
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    if (req.method === "POST"){
      const add = prisma.post.create({
        data: {
            topic: topic,
            content: content,
            short: short,
            mangaTitle: manga,
            author: {
                connect: {
                    email: session.user?.email
                }
            },
            

        }
    }).then((data) => {
      console.log(data);
      
        res.status(200).json({ message: "success" })
    }).catch((err) => {
        res.status(500).json({ message: "error" })
    }).finally(async () => {
        await prisma.$disconnect()
    })
  }
  else if (req.method === "PATCH") {
     
    const update = prisma.post.update({
      where: {
        id: id
      },
      data: {
        topic: topic,
        content: content,
        short: short,
        mangaTitle: manga,
      }
    }).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    }).finally(async () => {
      await prisma.$disconnect()
    })

    
  } else {
    res.status(401).json({ message: "not authorized" })
  }
  }
}