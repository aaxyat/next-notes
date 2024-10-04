'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Check } from "lucide-react"

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NoteApp</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="text-sm">Features</Button>
          <Button variant="ghost" className="text-sm">Pricing</Button>
          <Button variant="ghost" className="text-sm">About</Button>
          <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Capture Your Thoughts, Anytime, Anywhere</h2>
          <p className="text-xl mb-8">Organize your ideas, boost your productivity, and never forget a thing with NoteApp.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title="Easy Organization"
            description="Categorize your notes with tags and find them in an instant."
            icon={<Check className="h-6 w-6 text-orange-500" />}
          />
          <FeatureCard
            title="Sync Across Devices"
            description="Access your notes from anywhere, on any device."
            icon={<Check className="h-6 w-6 text-orange-500" />}
          />
          <FeatureCard
            title="Collaborative Editing"
            description="Share and edit notes with your team in real-time."
            icon={<Check className="h-6 w-6 text-orange-500" />}
          />
        </div>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 NoteApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}