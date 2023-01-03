import Navbar from "../components/Navbar";
import SearchComponents from "../components/searchbar";
import { useState, useContext, createContext, useEffect, useRef, useDebugValue } from "react";
import useSWR from 'swr'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import TopicForm from "../components/TopicForm";
import DropdownMenu from "../components/Dropdown";

const fetcher = (url: any) => fetch(url).then((res) => res.json())


export default function Home() {
  const { data: session } = useSession();
  const [input, setInput] = useState(" ")
  const [mode, setMode] = useState("fanfic")
  //fetching condition for searchbar
  function shouldFetch() {
    if(mode === "manga"){
      if (input.length > 0) {
        return `https://api.jikan.moe/v4/manga?q=${input}&order_by=popularity`
      }
      else {
        return `https://api.jikan.moe/v4/manga?order_by=score&sort=desc&limit=50&letter=katekyo%20hitman`}
      }
    else if (mode === "fanfic") {
      return `/api/getPosts?input=${input}&limit=20`
    }
    
  }
 
  //fetching data from api, refreshing every 0.5 seconds
  const {data, error, isLoading} = useSWR(shouldFetch, fetcher, { refreshInterval: 1500 })

  //mangas shuffling at first section.
  const mangaMainList = ["Reborn", "Naruto", "Bleach", "One Piece", "Fairy Tail", "Hunter x Hunter", "Dragon Ball", "Death Note", "Tokyo Ghoul", "Black Clover", "Attack-On-Titan"]
  const [mangaIwant, setMangaIwant] = useState("Reborn")
  useEffect(() => {
    const interval = setInterval(() => {
      setMangaIwant(mangaMainList[Math.floor(Math.random() * mangaMainList.length)])
    }, 1000);    
    return () => clearInterval(interval);
  }, []);

  const parentRef = useRef<null | HTMLDivElement>(null);

  function handleClickL() {
    setMode("fanfic")
  }
  function handleClickR() {
    setMode("manga")
  }
  function changeHandler(e: any) {
    setInput(e.target.value)
  }

  return (
      <div className="max-w-5xl mx-auto bg-red-100 h-full relative">
          <Navbar parentRef={parentRef}/>
          <div className="md:hidden absolute top-4 right-3 p-1 ">
          <DropdownMenu />
          </div>
          <div className='md:pt-8 h-fit md:flex w-full'>
            <div className='px-3 md:w-1/2 md:px-0 md:py-5 py-8'>
              <div className="flex flex-col place-content-center md:h-80">
                <h1 className='text-4xl font-bold pr-2 text-black text-center'>Go Fund Your Own</h1>
                <h2 className='text-5xl font-bold text-red-400 text-center'>{mangaIwant}</h2>
              </div>
            </div>
            <div className='md:w-1/2 my-auto px-3 md:px-0 mx-auto md:mr-6'>
              <TopicForm />
            </div>
          </div> 
        
          <div id="searchBar" ref={parentRef} className='mx-auto max-w-5xl mb-8 pt-8'>
            <div className="flex mb-1 justify-center md:justify-start pl-5">
              <button onClick={handleClickL} className={`p-1 w-1/5 ml-1 md:ml-0 rounded-l-lg bg-white border-2 border-black hover:bg-red-300 ${mode === "fanfic" ? "bg-red-300":""}`}>fanfic</button>
              <button onClick={handleClickR} className={`p-1 w-1/5 mr-1 md:mr-0 rounded-r-lg bg-white border-2 border-black hover:bg-red-400 ${mode === "manga" ? "bg-red-300":""}`}>manga</button>
            </div>
            <div className="px-5">
              <SearchComponents changeHandler={changeHandler} value={input}/>
            </div>
            
          </div>
          
          <div className='max-w-5xl mx-auto px-5'>
            {isLoading && <div>Loading...</div>}
            {mode === "fanfic" ? data?.map((fic: card) => (
              <div className='flex border rounded-xl' key={fic.topic}>
              <img className='basis-1/2 hover:cursor-pointer hover:scale-125 duration-300 my-2 rounded-2xl' src={fic.cover ? fic.cover: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"} alt="" />
              <div className='flex flex-col basis-1/2 ml-8'>
                <h2 className='my-2 text-2xl text-bold h-2/5 hover:cursor-pointer hover:text-gray-600'>{fic.topic}</h2>
                <p className='h-3/5'>{fic.short}</p>
              </div>
              </div>
            )): null}
            {mode === "manga" ? data?.data?.map((data: anime)=> (
              <div className='flex' key={data.mal_id}>
              <img className='hover:cursor-pointer hover:scale-125 duration-300 my-2 rounded-2xl' src={data.images.jpg.image_url} alt="" />
              <div className='flex flex-col ml-8'>
                <h2 className='my-2 text-xl h-2/5 hover:cursor-pointer hover:text-gray-600'>{data.title}</h2>
              </div>
              </div>
            )): null}
          </div>
      </div>
    )
}


type anime = {
  url: string,
  title_english: string,
  title: string,
  images: {
    jpg: {
      large_image_url: string,
      image_url: string},
  },
  mal_id : number
  topic: string,
  cover: string,
  short: string,
}

type card = {
cover?: string,
topic: string,
short?: string,
}