import React, { useEffect, useState, useRef } from 'react';
import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import dynamic from 'next/dynamic'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]';

const CustomEditor = dynamic(()=>import('../components/customEditor'),{ssr:false})
const mangaMainList = ["Reborn", "Naruto", "Bleach", "One Piece", "Fairy Tail", "Hunter x Hunter", "Dragon Ball", "Death Note", "Tokyo Ghoul", "Black Clover"]
interface IFromInput {
  topic: string;
  short: string;
  manga: string;
}

let GlobalData = {
  topic: "",
  short: "",
  manga: "",
} 
export default () => {
  const { data: session, status } = useSession();
  const [content,setContent] = useState('')
  const { register, handleSubmit } = useForm<IFromInput>();
  const onChange: SubmitHandler<IFromInput> = data => {
    GlobalData = data
    console.log(GlobalData) 
  }

  if(session) {
  return (
    (
      <div className="max-w-7xl mx-auto pt-3 space-y-6 px-2">

          <nav className='flex justify-end space-x-7 border-b-stone-300 border-b p-2'>
            <button className=' py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg' 
            onClick={()=>
            {
              const res = fetch('http://localhost:3000/api/addCompose', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',                  
                },
                body: JSON.stringify({
                  topic: GlobalData.topic,
                  content: content,
                  short: GlobalData.short,
                  manga: GlobalData.manga,
                }),
              })
              
            }}>Save</button>
            {session && 
              //profile image in circle
              <div className='flex items-center space-x-2'>
                {session.user?.image == null && <img className='w-8 h-8 rounded-full' src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="profile" />}
                {session.user?.image && <img className='w-8 h-8 rounded-full' src={session.user?.image} alt="profile" />}
                <h1 className='text-lg'>{session.user?.name}</h1>
              </div>
            }
            {!session && <a href="/login"><button className='py-1 px-6 bg-black text-white hover:bg-red-500 rounded-lg'>Login</button></a>}
            <a href="/"><h1 className='text-2xl text-bold hover:cursor-pointer'>ficfork</h1></a>
          </nav>
          <form onChange={handleSubmit(onChange)} className="flex flex-col max-w-2xl mx-auto space-y-3">
              <label htmlFor="">Topic</label>
              <input type="text" className='text-xl p-1 border rounded-lg' {...register("topic")}/>
              <label htmlFor="">Short</label>
              <textarea className='p-1 py-2 border rounded-lg resize-none' rows={4} cols={50}{...register("short")}/>
              <select {...register("manga")} className="rounded-xl p-2 border ">
                <option value="">select a manga</option>
                {mangaMainList.map((manga) => (
                <option key={manga} value={manga}>{manga}</option>
                ))}
              </select>
          </form>
          <CustomEditor setContent={setContent} content={content} />
      </div>
    )
  );
};
  
  return <div className='flex flex-col items-center justify-center p-8 h-screen'>
    <p className=' text-2xl'>Please login first</p>
    <a href="/login"><button className='bg-red-500 text-white rounded-lg p-2 mt-2 hover:bg-red-600'>Login</button></a>
    <br />
    <br />
    <br />
    <br />
    <a href="/"><h1 className='text-xl '>ficfork</h1></a>
  </div>
}


export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}