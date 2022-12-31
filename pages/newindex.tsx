import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { PrismaClient } from "@prisma/client";
// import session from "./api/session/session";
import { signIn, signOut, useSession } from "next-auth/react"

const prisma = new PrismaClient();

function CreateArea(props: any) {
    const { data: session, status } = useSession()
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event: any) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  async function submitNote(event: any) {
    const post =  await prisma.post.create({
        data: {
          topic: note.title,
          cover: "",
          content: "",
          short: note.content,
          author: {
            connect: {
              email: session!.user!.email!
          }
        }
    }}
    );

    // props.onAdd(note);
    // setNote({
    //   title: "",
    //   content: ""
    // });
    event.preventDefault();
  }

  return (
    <div>
        <div>
            <Navbar />
        </div>
        
      <form className="flex flex-col max-w-4xl mx-auto mt-10">
        <h1 className="text-5xl font-mono">Post your manga idea!</h1>
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
          className="border-4 border-gray-800 p-5 rounded-lg mt-3"
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={6}
          className="border-4 border-gray-600 p-5 rounded-lg mt-3"
        />
        <button onClick={submitNote} className="p-5 bg-gray-800 text-white rounded-lg mt-3 hover:bg-gradient-to-r from-aYellow to-aRose text-xl font-bold">Post</button>
      </form>
      <div className="flex max-w-2xl mx-auto mt-10">
                <input type="text" placeholder="Type to search" className="p-3 w-full border-gray-800 border-2 rounded-lg"/>
                <button className="bg-black p-3 text-white rounded-lg right-10 relative">Search</button>
      </div>
      <button className="bg-black p-3 text-white ml-1">Filters</button>
    </div>
  );
}

export default CreateArea;
