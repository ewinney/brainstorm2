import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-8">
          Welcome to AI-Powered Brainstorming
        </h1>

        <p className="mt-3 text-2xl mb-8">
          Collaborate, ideate, and innovate with our intelligent brainstorming board.
        </p>

        <Link href="/brainstorm-board">
          <Button className="px-6 py-3 text-lg">Start Brainstorming</Button>
        </Link>
      </main>
    </div>
  )
}