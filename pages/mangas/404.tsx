import Link from 'next/link'

export default function FourOhFour() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='mb-5'>404 - Page Not Found</h1>
        <Link href="/" >
            <a className='bg-blue-400 p-3 rounded-full text-white'>Go home</a>
        </Link>    
    </div>
    )
}