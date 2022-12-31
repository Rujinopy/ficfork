import { GetStaticPaths, GetStaticProps, GetServerSideProps} from "next"
import { NextApiResponse } from "next"
import Navbar from "../../components/Navbar"
import { useRouter } from "next/router"
import { useState,useEffect } from "react"
import { PrismaClient } from "@prisma/client"
import { RiSideBarFill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link"
import { redirect } from "next/dist/server/api-utils"
export  default function MangaPage ({posts}: any) {
    
  const [sidebar, setSidebar] = useState(true)
  console.log(posts);
    return  (
      <div>
        <div className="flex flex-row bg-[#EDEDED]">
          <div id="sidebar" className={`bg-liveOrange border hidden md:flex flex-col border-r-4 border-red-300 min-h-screen ${sidebar ? 'md:w-1/5': 'md:w-10'} duration-300`}>
            <div className={`w-full overflow-hidden flex ${sidebar ? 'justify-end' : 'justify-center flex-col'}`}>
              <a href="" className={`${sidebar ? 'null' : 'pr-0'} pr-1 pt-1`} onClick={(e) => {setSidebar(!sidebar); e.preventDefault();}}>
                <RiSideBarFill className={`fill-white w-10 h-10 p-2 hover:bg-red-400 `} />
              </a>
              <Link href={'/'}><AiFillHome className={`fill-white w-10 h-10 p-2 hover:bg-red-400 hover:cursor-pointer ${sidebar ? 'hidden' : ''}`} /></Link>
            </div>
            <div className="justify-center flex flex-col ">
              <h1 className={`text-white text-4xl mx-auto p-4 font-bold font-mono ${sidebar ? 'null' : 'hidden'}`}>
                {capitalize(posts[0].title)}
              </h1>
              <img src={posts[0].cover} className={`p-3 mx-auto border-white ${sidebar ? 'null' : 'hidden'}`} width={200} height={400} alt="" />
              <div className={`w-full items-center flex justify-center text-center py-3 text-white text-xl hover:cursor-pointer hover:bg-red-300 ${sidebar ? '' : 'hidden'}`}>
              <h1 className="">Home</h1>
              </div>
            </div>
          </div>
          <div id="body-content" className=" w-full md:w-3/4 mx-auto p-10 mt-12">
            <div className="mx-auto w-full flex mb-7">
                <input type="text" placeholder="Search..." className="w-1/2 p-3"/>
                <button className="bg-red-400 p-3 hover:bg-red-300 text-white">Search</button>
            </div>
            {posts[0].posts.map((post: any) => (
              <div key={post.id} className="rounded-md border my-2 border-cyan-700 h-60 flex md:flex-row flex-col bg-white">
                <div className="w-full md:w-1/3 flex flex-col bg-red-500">
                  <Link href={"/"} >
                    <img src={post.cover} alt="" className="overflow-hidden cursor-pointer hover:opacity-90"/>
                  </Link>
                </div>
                <div className="md:w-1/2 p-2 pl-5 pt-8">
                  <a className="hover:cursor-pointer hover:underline"><h1 className=" text-xl md:text-2xl font-bold">{post.topic}</h1></a>
                  <p className="text-xs md:text-sm text-slate-600">{post.short}</p>
                </div>
                <div className="md:w-1/6 bg-blue-400 items-center justify-center flex flex-col pb-9">
                  <h1 className="text-white text-xl font-bold">ยอดระดมทุน</h1>
                  <h1 className=" text-3xl md:text-5xl text-white pt-3">{post.funding}</h1>
                  <h1 className=" text-md md:text-2xl font-bold text-white">-------</h1>
                  <h1 className=" text-md md:text-2xl text-white">15,000</h1>
                </div>
                
              </div>)
            )}
          </div>
        </div>
      </div>
      )
    }


function capitalize(slug: String){
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}


// export const getStaticPaths: GetStaticPaths = async () => {
//   const prisma = new PrismaClient()
//   const mangas = await prisma.category.findMany()

//   const paths = mangas.map((manga) => ({
//     params: { slug: manga.title },
//   }))
//   return { paths, fallback: false }
// }


export const getServerSideProps:GetServerSideProps = async (context: any) => {
  const {slug} = context.params
  const prisma = new PrismaClient()
  const posts = await prisma.category.findMany({
    where: {
      title: slug
    },
    include: {
      posts:{
        select: {
          short: true,
          content: true,
          author: true,
          funding: true,
          likes : true,
          cover: true,
          topic: true,
      }
      },
    }
    })

  return {
    props : { posts }
  }
}

