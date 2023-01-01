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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    
    if (query.get("success")) {
      console.log(
        "Order placed! You will receive an email confirmation."
      );
      // const addMoney = async () => {
      //   const res = await fetch('/api/addMoney', {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       amount: 40,
      //       id: newPost.id
      //     })
      //   })
      //   const data = await res.json()
      //   console.log(data)
      // }
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <div className="">
      <nav className={`flex justify-end mx-auto space-x-8 p-3 pr-3 md:pr-0 
      h-20 md:h-auto bg-white rounded-full max-w-3xl sticky  ${visible == true ? "" : "hidden"}`}>
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
                        {session.user?.image == null && <img className='w-8 h-8 rounded-full' src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="profile" />}
                        {session.user?.image && <Link href="/profile"><img className='hover:cursor-pointer w-8 h-8 rounded-full' src={session.user?.image} alt="profile" /></Link>}
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
              <SwiperSlide key={block} className="flex items-center justify-center">
                <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
              </SwiperSlide>
            )
        }
        if (block.type === "subheader") {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
              <h2 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 3) {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
              <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "header" && block.data.level === 4) {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
              <h4 className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "paragraph") {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
              <p className="text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            </SwiperSlide>
          )
        }
        if (block.type === "image") {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
              <img className="w-full" src={block.data.file.url} alt="" />
            </SwiperSlide>
          )
        }
        if (block.type === "list") {
          return (
            <SwiperSlide key={block} className="flex items-center justify-center">
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
  }).finally(async () => {
    await prisma.$disconnect()
  })

  const newPost = JSON.parse(JSON.stringify(post))

  return { props: { newPost } }
}

