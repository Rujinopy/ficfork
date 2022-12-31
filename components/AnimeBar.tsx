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
        <div className="mt-2 bg-white justify-center space-x-7 max-w-5xl mx-auto py-2 md:block flex-grow lg:flex lg:items-center lg:w-auto rounded-full border-2 border-black">
          
          {animeList.map((anime, index) => (
            <Link href={`/posts/${anime}`} key={index}>
              <img onClick={props.handleClick} src={anime.image} alt={anime.name} className='w-16 h-16 rounded-full hover:cursor-pointer hover:border-2 hover:border-red-500 ' />
            </Link>
          ))}
              
      </div>
    )
}