// const mangaMainList = ["Reborn", "Naruto", "Bleach", "One Piece", "Fairy Tail", "Hunter x Hunter", "Dragon Ball", "Death Note", "Tokyo Ghoul", "Black Clover", "Attack-On-Titan"]
import AnimeBar from "../components/AnimeBar";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Card from "../components/Card";
import useSWRInfinite from 'swr/infinite'
import SearchComponent from "../components/searchbar";
//fetch all posts categorized by mangaMainList
import Link from "next/link";
const fetcher = (url: any) => fetch(url).then((res) => res.json())
const limit = 4    

export default function Category() {
    const { data: session } = useSession();
    //clicking anime bar to fetch data
    const [animeName, setAnimeName] = useState("")
    
    //logging animeName everytime it changes
    const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault()
        setAnimeName(e.currentTarget.alt)
    }

    const getKey = (pageIndex: number, previousPageData: any) => {
        pageIndex = pageIndex * limit
        if (previousPageData && !previousPageData.length) return null // reached the end
        return `http://localhost:3000/api/getPosts?input=${animeName}&limit=4&skip=${pageIndex}` // SWR key
        }
    const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher)
    const newData = data?.flat()
    console.log(newData);
    
    return (
        <div className="bg-slate-800">
        <div className="max-w-7xl mx-auto bg-white h-screen p-3">
            
            <nav className='flex justify-end space-x-7 p-3 h-20 md:h-auto bg-white rounded-full'>
                {session && 
                    //profile image in circle
                    <div className='flex items-center space-x-2'>
                        {session.user?.image == null && <img className='w-8 h-8 rounded-full' src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="profile" />}
                        {session.user?.image && <Link href="/profile"><img className='hover:cursor-pointer w-8 h-8 rounded-full' src={session.user?.image} alt="profile" /></Link>}
                        <h1 className='text-lg'>{session.user?.name}</h1>
                    </div>
                }
                {!session && <a href="/login"><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Login</button></a>}
                <a href="/" className="flex items-center"><h1 className='text-2xl text-bold hover:cursor-pointer'>ficfork</h1></a>
            </nav>            
            <h1 className="text-center my-3 text-2xl text-black">Choose a manga</h1>
            <div className="hidden md:flex">
            <AnimeBar handleClick={handleClick} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:px-0 mt-5 w-full md:w-auto ">
                {newData?.map((post: any) =>  (
                     <Card id={post.id} topic={post.topic} short={post.short} cover={post.cover} />
                ))}
                
            </div>
            
            <div className="flex justify-center my-3">
            <button className="rounded-full bg-white  p-2 hover:border hover:border-black" onClick={() => setSize(size + 1)}> Load more</button>

            </div>
            
        </div>
        </div>
    )
}
