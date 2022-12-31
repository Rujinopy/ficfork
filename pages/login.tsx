import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from './header.module.css'
import { SubmitHandler, useForm } from "react-hook-form"

type FormValues = {
  username: string;
  password: string;
}

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { register, handleSubmit } = useForm<FormValues>()
  

  const onSubmit: SubmitHandler<FormValues> = data => {
    //send data to database
    console.log(data);
    
    signIn("credentials", {username: data.username, password: data.password, callbackUrl: "http://localhost:3000/"})
    // window.location.href = "/"
    
  }

  return ( 
    <div>
      <div id="body" className="h-screen max-w-xl mx-auto border my-8">
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="flex flex-col items-center">
            <div className="logo">
              <img src="" alt="" />
            </div>
            <div className="flex flex-col w-3/4">
              <h1 className="p-8 pl-0 font-PT bold text-3xl">LOGIN</h1>
              <label htmlFor="email" className="font-PT text-md">Email or Username</label>
              <input type="email" {...register("username")} className="border-2 border-gray-300 rounded-lg p-2 my-2" />
            </div>
            <div className="flex flex-col w-3/4">
              <label htmlFor="password" className="font-PT text-md">Password</label>
              <input type="password" {...register("password")} className="border-2 border-gray-300 rounded-lg p-2 my-2" />
            </div>
             {/*submit input  */}
            <input type="submit" value="Login" className="hover:cursor-pointer text-center w-3/4 relative p-4 border rounded-lg hover:border mt-5 bg-[#1877f2] hover:bg-blue-500 text-white" />
            
            {/* <button type="submit" className="text-center w-3/4 relative p-4 border rounded-lg hover:border mt-5 bg-[#1877f2] text-white">Login</button> */}
          </div>
        </form>
        <h2 className="text-xl text-center py-3"> OR</h2>
        <div className="flex flex-col items-center space-y-4">
          <a className="text-center w-3/4 relative p-4 border rounded-lg hover:bg-[#ea4335] hover:text-white" 
          onClick={(e) => {
            e.preventDefault()
            signIn("google", { callbackUrl: "http://localhost:3000/" })
          }}
          href={`/api/auth/signin`} ><svg width="25px" height="35px" className="inline absolute left-1 bottom-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>Sign In With Google</a>
          <a className="text-center w-3/4 relative p-4 border rounded-lg hover:border hover:bg-[#1877f2] hover:text-white"
          onClick={(e) => {
            e.preventDefault()
            signIn("facebook", { callbackUrl: "http://localhost:3000/" })
          }}
          href={`/api/auth/signin`}><svg width="25px" height="35px" className="inline absolute left-1 bottom-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/>
          </svg>Sign In with Facebook</a>
          <a className="text-center w-3/4 relative p-2 hover:text-gray-600" href="/signup">Sign up with your email</a>

        </div>
      </div>
    </div>
  )
}