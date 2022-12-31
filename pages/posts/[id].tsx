import { PrismaClient } from "@prisma/client"
import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Pagination } from "swiper";
import { useEffect, useState } from "react";
import { includes } from "lodash";
export default function Home({ newPost }: any) {
  const { data: session } = useSession();
  console.log(newPost);

  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [visible, setVisible] = useState(true);
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    setPrevScrollpos(currentScrollPos);
    setVisible(visible);
  };


  return (
    <div className="">
      <nav className={`flex justify-end mx-auto space-x-8 p-3 pr-3 md:pr-0 
      h-20 md:h-auto bg-white rounded-full max-w-3xl sticky  ${visible == true ? "" : "hidden"}`}>
                {session && 
                    //profile image in circle
                    
                    <div className='flex items-center space-x-2'>
                        {session.user?.email == newPost.author.email && <a href={`/posts/edit/${newPost.id}`}><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Edit</button></a>}
                        {session.user?.image == null && <img className='w-8 h-8 rounded-full' src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="profile" />}
                        {session.user?.image && <img className='w-8 h-8 rounded-full' src={session.user?.image} alt="profile" />}
                        <h1 className='text-lg'>{session.user?.name}</h1>
                    </div>
                }
                {!session && <a href="/login"><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Login</button></a>}
                <a href="/" className="flex items-center"><h1 className='text-2xl text-bold hover:cursor-pointer'>ficfork</h1></a>
      </nav>
      <Swiper
        direction={"vertical"}
        slidesPerView={1}
        spaceBetween={5}
        mousewheel={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 5,
        }}
        modules={[Mousewheel, Pagination]}
        className="w-full h-screen bg-white md:max-w-3xl mx-auto overflow-hidden"
      >
        {newPost.content?.blocks?.map((block: any) => {
          if (block.type === "header") {
            return (
              <SwiperSlide className="flex items-center justify-center">
                <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </SwiperSlide>
            )
        }
        if (block.type === "subheader") {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <h2 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 3) {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 4) {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <h4 className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "paragraph") {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <p className="text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "image") {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <img className="w-full" src={block.data.file.url} alt="" />
            </SwiperSlide>
          )
        }
        if (block.type === "list") {
          return (
            <SwiperSlide className="flex items-center justify-center">
              <ul className="list-disc list-inside" dangerouslySetInnerHTML={{ __html: block.data.items }} />
            </SwiperSlide>
          )
        }
        })}

        
        
      </Swiper>      
      {/* <div className="max-w-2xl mx-auto pt-8">
        {newPost.content.blocks.map((block: any) => {
          if (block.type === "header") {
            return <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }}/>
          }
          if (block.type === "subheader") {
            return <h2 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          }
          if (block.type === "header" && block.data.level === 3) {
            return <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          }
          if (block.type === "header" && block.data.level === 4) {
            return <h4 className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          }
          if (block.type === "paragraph") {
            return <p className="text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
          }
          if (block.type === "image") {
            return <img src={block.data
              .file.url} alt={block.data.caption} />
            }
          if (block.type === "list") {
            return <ul className="list-disc list-inside" dangerouslySetInnerHTML={{ __html: block.data.items }} />
          }

        }
        )}
      </div> */}
    </div>
  )
}
  

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient()
  //fetch paths from database
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      }
    })
  const paths = posts.map((post: any) => {
    return {
      params: { 
        id: post.id 

      }
    }
  } )
  
  return { paths, fallback: false } 
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prisma = new PrismaClient()
  //prisma fetch data
  const post = await prisma.post.findUnique({
    where: {
      id: params!.id
    },
    select: {
      id: true,
      topic: true,
      content: true,
      author: {
        select: {
          email: true,
      }
    }
    }
  })

  const newPost = JSON.parse(JSON.stringify(post))

  return { props: { newPost } }
}

