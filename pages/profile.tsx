import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import {AiFillCloseCircle} from "react-icons/ai"
export default function Profile({ user } : any) {
    const { data: session } = useSession()
    
    //all posts state
    const [posts, setPosts] = useState(user.posts)

    //delete post
    const deletePost = (id: any) => {
        fetch(`/api/addCompose`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        }).then((res) => {
            if (res.status === 200) {
                setPosts(posts.filter((post: any) => post.id !== id))
            }
        })
    }


    if (!session) {
        return (
            <div>
            <h1>Not logged in</h1>
            <a href="/login"><button className="p-2 bg-black text-white text-xl">Login</button></a>
            </div>
        )
    }

    return (
        
    <div className="max-w-7xl flex flex-col mx-auto p-2 md:p-2">
        <nav className='flex justify-end space-x-7 p-3 h-20 md:h-auto bg-white rounded-full'>
            <a href="/" className="flex items-center mx-auto md:mx-0 md:pr-8"><h1 className='text-3xl font-bold hover:cursor-pointer'>ficfork</h1></a>
        </nav>
        <div className="">
            <h1 className="text-xl font-bold md:text-3xl py-5 bg-white">Profile</h1>
            <div className="flex place-content-center md:place-content-start md:pl-12">
                <img className="w-32 h-32 rounded-full" src={session.user?.image ? "session.user?.image": "blank_profile.png"} alt="profile" />
                <div className="flex flex-col place-content-center px-5">
                <h1 className="md:text-3xl ">{session.user?.name}</h1>
                <h1 className={!session.user?.image ? "text-3xl": ""}>{session.user?.email}</h1>
                <div className="flex text-lg">
                    <h1>posted:&nbsp;</h1>
                    <h1>{user.posts.length}</h1>
                </div>
                </div>
            </div>
        </div>
        
        <div>
            <h1 className="text-xl font-bold md:text-3xl py-5 bg-white">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post: any) => (
                    <div className="mx-auto w-80 rounded-2xl overflow-hidden border-2 shadow-md hover:scale-105 duration-300 bg-white relative">
                        <div onClick={() => {deletePost(post.id)}} className="absolute top-1 right-2 z-50 bg-black rounded-full hover:bg-red-100 hover:cursor-pointer">
                            <AiFillCloseCircle color="red" size={30} />
                        </div>
                        <div className="w-80 h-64 max-w-xs max-h-64 overflow-hidden flex justify-center hover:cursor-pointer">
                            <Link href={`/posts/${post.id}`}><img className="w-full" src={post.cover ? post.cover: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt=""></img></Link>
                        </div>
                        <div className="h-full">
                            <div className="px-3 py-2 pb-0 flex flex-col">
                                <div className="font-bold text-xl mb-2 hover:cursor-pointer hover:underline ">{post.topic}</div>
                                <p className="text-gray-700 text-base h-10">
                                    {post.short > 100 ? post.short.slice(0, 100) + "..." : post.short }
                                </p>
                                
                            </div>
                        </div>
                        <div className="flex bg-red-200 rounded-full place-content-center p-1 mb-1 absolute bottom-1 right-2 text-xs w-auto">
                                    <h2>funded:&nbsp;</h2>
                                    <h2>{post.funding}</h2>
                        </div>
                    </div>
                ))}
            </div> 
        </div>
    </div>
  )
}


export const getServerSideProps:GetServerSideProps = async (context: any) => {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      )
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
        where: {
            email: session!.user!.email?.toString()
        },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            posts: {
                select: {
                    id: true,
                    topic: true,
                    short: true,
                    cover: true,
                    likes: true,
                    funding: true
            }
        }
    }
})

    return {
      props: {
        session,
        user
      }
    }
  }