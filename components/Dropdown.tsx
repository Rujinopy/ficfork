import React, { useState } from 'react';
import {GrMenu} from 'react-icons/gr'
import Link from 'next/link';
import { useSession } from "next-auth/react"


const DropdownMenu = (props: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession()
    
    
  return (
    <div className="relative flex text-left">
        
      {/* <Link href={"/profile"}>
        
            <a className="pr-3"><img className="w-10 h-10 rounded-full hover:border-2 border-black" src={session?.user?.image === undefined ? "session.user?.image":"/home/ruji/mangafork-next/public/blank_profile.png"} alt="" /></a>
        
      </Link> */}
      <div>
        <span className=" ">
          <button
            type="button"
            className="inline-flex w-full hover:bg-red-200"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <GrMenu size={40} />
          </button>
        </span>
      </div>
      <div className={`${menuOpen ? 'block' : 'hidden'} origin-top-right absolute top-8 right-0 mt-2 w-56 rounded-md `}>
        <div className="rounded-md bg-white ">
          <div className="py-1">
          <Link href={"/"}>
              <button className="border block px-8 py-4 text-sm w-full leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">Home</button>
          </Link>  
          <Link href={"/compose"}>
              <button className="border block px-8 py-4 text-sm w-full leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">Publish</button>
          </Link>

          <Link href={"/category"}>
              <button className="border block px-8 py-4 text-sm w-full leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">Category</button>
          </Link>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;