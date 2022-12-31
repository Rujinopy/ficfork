import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"

export default function Profile({ user } : any) {
    const { data: session } = useSession()
    
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
                <img className="w-1/8 rounded-full" src={session.user?.image} alt="profile" />
                <div className="flex flex-col place-content-center px-5">
                <h1 className="md:text-3xl">{session.user?.name}</h1>
                <h1>{session.user?.email}</h1>
                <div className="flex">
                    <h1>posted: </h1>
                    <h1>{user.posts.length}</h1>
                </div>
                </div>
            </div>
        </div>
        
        <div>
            <h1 className="text-xl font-bold md:text-3xl py-5 bg-white">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.posts.map((post: any) => (
                    <div className="mx-auto max-w-xs w-full rounded-2xl overflow-hidden border-2 shadow-md hover:scale-105 duration-300 bg-white">
                        <div className="w-80 h-64 max-w-xs max-h-64 overflow-hidden flex justify-center hover:cursor-pointer">
                            <Link href={`/posts/${post.id}`}><img className="w-full" src={post.cover ? post.cover: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt=""></img></Link>
                        </div>
                        <div>
                            <div className="px-3 py-2 flex flex-col relative">
                                <div className="font-bold text-xl mb-2 hover:cursor-pointer hover:underline ">{post.topic}</div>
                                <p className="text-gray-700 text-base h-10">
                                    {post.short > 100 ? post.short.slice(0, 100) + "..." : post.short }
                                </p>
                                <div className="flex bg-black text-white rounded-lg w-1/5 p-1 place-content-center absolute bottom-1 right-1">
                                    <h2>Like :&nbsp;</h2>
                                    <h2>{post.likes}</h2>
                                </div>
                            </div>
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
            email: session!.user!.email 
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
                    content: true,
                    short: true,
                    cover: true,
                    likes: true,
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