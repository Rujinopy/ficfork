import { PrismaClient } from "@prisma/client"
import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Pagination } from "swiper";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import DropdownMenu from "../../components/Dropdown";
const prisma = new PrismaClient()


export default function Home({ newPost }: any) {
  const { data: session } = useSession();
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [visible, setVisible] = useState(true);
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    setPrevScrollpos(currentScrollPos);
    setVisible(visible);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("ORDER SUCCESS Enjoy your fic!");
      //call addMoney
        const addMoney = async () => {
         await fetch('/api/addMoney', {
            method: 'PATCH',
            body: JSON.stringify({
                amount: 40,
                id: newPost.id,
              }),
            headers: {
              'Content-Type': 'application/json'
            },
            })
        }
        addMoney()
      // remove recent query string from this url after 1 sec
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/posts/" + newPost.id);
      }, 1000);
      
    }
    if (query.get("canceled")) {
      alert("ORDER CANCEL  -- continue to scroll around");
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/posts/" + newPost.id);
      }, 1000);
    }
  }, []);

  return (
    <div className="relative">
      <nav className={`flex justify-end mx-auto space-x-8 p-3 pr-3 md:pr-0 
      h-20 md:h-auto bg-white rounded-full max-w-3xl md:sticky absolute w-screen z-50 md:w-auto ${visible == true ? "" : "hidden"}`}>
                {session && 
                    //profile image in circle
                    <div className='flex items-center space-x-2'>
                        <form action="/api/checkout_sessions" method="POST" className="px-3 py-1 rounded-lg font-bold text-white hover:border-2 hover:border-black bg-red-500">
                            <section>
                                <button type="submit" role="link">
                                    Pledge 40 THB
                                </button>
                            </section>
                        </form>
                        {session.user?.email == newPost.author.email && <a href={`/posts/edit/${newPost.id}`}><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Edit</button></a>}
                        {session.user?.image == null && <img className='hidden hover:cursor-pointer md:block w-8 h-8 rounded-full' src="/blank_profile.png" alt="profile" />}
                        {session.user?.image && <Link href="/profile"><img className='md:block hover:cursor-pointer w-8 h-8 rounded-full' src={session.user?.image} alt="profile" /></Link>}
                        <h1 className='hidden md:block text-lg'>{session.user?.name}</h1>
                    </div>
                }
                {!session && <a href="/login"><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Login</button></a>}
                <a href="/" className="flex items-center"><h1 className='font-bold hidden md:block text-2xl text-bold hover:cursor-pointer'>ficfork</h1></a>
                <div className="md:hidden pt-2 z-50">
                  <DropdownMenu />
                </div>
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
        className="w-full h-screen bg-white md:max-w-3xl mx-auto overflow-hidden border"
      >
        {newPost.content?.blocks?.map((block: any, index: any) => {
          if (block.type === "header") {
            return (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </SwiperSlide>
            )
        }
        if (block.type === "subheader") {
          return (
            <SwiperSlide key={index}  className="flex items-center justify-center">
              <h2 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 3) {
          return (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 4) {
          return (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <h4 className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "paragraph") {
          return (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <p className="text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "image") {
          return (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <img className="w-full" src={block.data.file.url} alt="" />
            </SwiperSlide>
          )
        }
        if (block.type === "list") {
          return (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <ul className="list-disc list-inside" dangerouslySetInnerHTML={{ __html: block.data.items }} />
            </SwiperSlide>
          )
        }
        })}
      </Swiper>      
    </div>
  )
}
  
export const getStaticPaths: GetStaticPaths = async () => {
  //fetch paths from database
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      }
    }).finally(async () => {
      await prisma.$disconnect()
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
  //prisma fetch data
  const post = await prisma.post.findUnique({
    where: {
      id: params!.id?.toString()
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
  }).finally(async () => {
    await prisma.$disconnect()
  })

  const newPost = JSON.parse(JSON.stringify(post))

  return { props: { newPost } }
}

