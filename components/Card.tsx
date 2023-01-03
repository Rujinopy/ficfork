import Link from "next/link"


export default function Card(props: any) {
  return (
    <div className="mx-auto w-60 h-100 rounded-2xl overflow-hidden shadow-black shadow-md hover:scale-105 duration-300 bg-white border-2 border-black">
      <div className="w-full h-2/3 overflow-hidden flex justify-center hover:cursor-pointer">
        <Link href={`/posts/${props.id}`}>
          <img
            className="w-full h-60"
            src={
              props.cover
                ? props.cover
                : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt=""
          ></img>
        </Link>
      </div>
      <div className="px-6 py-4 relative">
        <div className="font-bold text-xl mb-2 hover:cursor-pointer hover:underline ">
          {props.topic}
        </div>
        <p className="text-gray-700 text-base">
          {props.short > 100 ? props.short.slice(0, 100) + "..." : props.short}
        </p>
        <div className="flex bg-red-200 rounded-full place-content-center absolute botton-1 right-3 p-1 text-xs">
          <h2>funded:&nbsp;</h2>
          <h2>{props.funding}</h2>
        </div>
      </div>
    </div>
  );
}