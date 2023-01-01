import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"


function Navbar(props: any) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  
  const {parentRef} = props
  const handleClick = () => {
    if (parentRef.current) {
      parentRef.current.scrollIntoView({ behavior: 'smooth',block: "start", inline: "nearest"});
    }
  };

  return (
    <nav className="px-2">  
      <Link href={"/"}>
              <h1 className="text-4xl cursor-pointer p-2 w-full text-center text-bold text-black md:text-black ">FicFork</h1>
      </Link>    
      <div className="hidden justify-center space-x-7 w-full py-2 md:block flex-grow lg:flex lg:items-center lg:w-auto rounded-full bg-red-500 border-4 border-black">
          
          {/* <Link href={"/introduction"}>
              <button className=" text-white hover:border-black hover:border rounded-full text-lg py-1 px-2">Tutorial</button>
          </Link> */}

          <Link href={"/compose"}>
              <button className=" text-white hover:border-black hover:border rounded-full text-lg py-1 px-2">Publish</button>
          </Link>

          <Link href={"/category"}>
              <button className=" text-white hover:border-black hover:border rounded-full text-lg py-1 px-2">Category</button>
          </Link>

          
              <button onClick={handleClick} className=" text-white hover:border-black hover:border rounded-full text-lg py-1 px-2">Search</button>
          
          
        {!session && <>
          
          <Link href={"/signup"}>
            <button className="text-white hover:border-black hover:border rounded-full  text-lg py-1 px-2">Sign up</button>
          </Link>
         
          <Link href={"/login"}>
            <button className="bg-white border border-black hover:bg-gradient-to-r from-aYellow to-aRose text-black font-bold py-1 px-3 rounded-full">Login</button>
          </Link>
          
        </>}
        {session && <>
          <h1>{session.user?.name || session.user?.email }</h1>
          <Link href={"/profile"}>
            <a className="p-3"><img className="w-12 h-12 rounded-full" src={session.user?.image} alt="" /></a>
          </Link>
          <button onClick={() => signOut()} className="bg-black hover:bg-gradient-to-r from-aYellow to-aRose text-white font-bold py-2 px-4 rounded-full">Sign out</button>
        </>}
      </div>
    </nav>
  );

}

export default Navbar;