import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl">Class not found</h2>
      <Link href="/">
        <p className="mt-4 text-blue-500">Go back to home</p>
      </Link>
    </div>
  )
}