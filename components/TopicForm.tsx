import { redirect } from "next/dist/server/api-utils";
import ReactDOM from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
// import session from "../pages/api/session/session";
import { signIn, useSession } from 'next-auth/react'
const mangaMainList = ["Reborn", "Naruto", "Bleach", "One Piece", "Fairy Tail", "Hunter x Hunter", "Dragon Ball", "Death Note", "Tokyo Ghoul", "Black Clover"]

interface IFormInput {
  topic: String;
  short: String;
  manga: String;
}

export default function App() {
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async data => {
  //detect if user is filled all the fields
    if (data.topic === "" || data.short === "" || data.manga === "") {
      alert("Please fill all the fields")
    }
    //if no session, redirect to login page
    else if (!session) {
      await signIn()
      await fetch('/api/addCompose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    }
    else {
      await fetch('/api/addCompose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.status === 200) {
          alert("Add your topic successfully. Check your topic in your profile page")
          window.location.href = "/profile"
        }
      })
    }
    //if all the fields are filled, send data to database
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col border-4 border-gray-800 w-full rounded-lg px-4 py-5 space-y-3 ">
      <label className="text-lg">Topic</label>
      <input required className="border border-gray-800 rounded-md py-2 px-1" {...register("topic")} />
      <label className="text-lg">Short</label>
      <textarea className="border border-gray-800 rounded-md py-2 px-1 resize-none" rows={4} cols={50} {...register("short")} />
      <label className="text-lg">Manga selection</label>
      <select {...register("manga")} className="rounded-xl p-1 border border-black">
        <option value="">select a manga</option>
        {mangaMainList.map((manga) => (
          <option key={manga} value={manga}>{manga}</option>
        ))}
      </select>
      <button className="p-1 px-0 text-md bg-white border-2 border-black hover:bg-gradient-to-r from-aYellow to-aRose w-1/5 rounded-lg" type="submit" value="Submit">Publish</button>
    </form>
  );
}
