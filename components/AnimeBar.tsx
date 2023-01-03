import Link from 'next/link'
import { type } from 'os'
import { useEffect } from 'react'
import { animeList } from './Animelist'

type animeName = {
  name: string
}

export default function animeBar(props: any) {

    //when clicking each anime circle bar, sending anime.name to category.tsx
    const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      props.handleClick(e.currentTarget.alt)
    }

 
    return (
        <div className="md:mt-2 md:bg-white pl-8 md:pl-0 justify-center md:space-x-7 w-full md:max-w-5xl mx-auto py-2 grid grid-cols-4 md:block flex-grow lg:flex lg:items-center lg:w-auto rounded-md md:rounded-full md:border-2 md:border-black">
          
          {animeList.map((anime, index) => (
            <Link href={`/posts/${anime}`} key={index}>
              <img onClick={props.handleClick} src={anime.image} alt={anime.name} className='w-14 h-14 rounded-full hover:cursor-pointer my-1 hover:border-2 hover:border-red-500 ' />
            </Link>
          ))}
              
      </div>
    )
}