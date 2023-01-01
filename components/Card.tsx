import Link from "next/link"


export default function Card(props: any) {
    return (
        <div className="mx-auto max-w-xs w-full rounded-2xl overflow-hidden border-2 border-black hover:scale-105 duration-300 bg-white">
                <div className="w-auto h-auto max-w-xs max-h-64 overflow-hidden flex justify-center hover:cursor-pointer">
                   <Link href={`/posts/${props.id}`}><img className="w-full" src={props.cover ? props.cover: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt=""></img></Link>
                </div>
                
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 hover:cursor-pointer hover:underline ">{props.topic}</div>
                    <p className="text-gray-700 text-base">
                      {props.short > 100 ? props.short.slice(0, 100) + "..." : props.short }
                    </p>
                </div>
                
              </div>
    )
}