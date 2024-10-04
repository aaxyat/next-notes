import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { UserButton, SignOutButton } from "@clerk/nextjs"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="ghost"
              size="icon"
              className="text-gray-900 dark:text-gray-100"
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <UserButton 
              appearance={{
                elements: {
                  rootBox: "hover:scale-110 transition-transform",
                  avatarBox: "w-10 h-10",
                  userPreviewMainIdentifier: theme === 'dark' ? "text-white font-bold" : "text-gray-900 font-bold",
                  userPreviewSecondaryIdentifier: theme === 'dark' ? "text-gray-300" : "text-gray-500",
                  userPreviewSecondaryIdentifierText: "text-sm",
                  userButtonPopoverCard: theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200",
                  userButtonPopoverActionButton: theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-100",
                  userButtonPopoverActionButtonText: theme === 'dark' ? "text-white" : "text-gray-700",
                  userButtonPopoverActionButtonIcon: theme === 'dark' ? "text-gray-300" : "text-gray-500",
                  userButtonTriggerIcon: theme === 'dark' ? "text-gray-300" : "text-gray-700",
                  footerActionLink: theme === 'dark' ? "text-white hover:text-gray-200" : "text-gray-700 hover:text-gray-900",
                  footerActionText: theme === 'dark' ? "text-gray-300" : "text-gray-500",
                },
              }}
            />
            <SignOutButton>
              <Button variant="ghost" className="text-gray-900 dark:text-white">Sign out</Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  )
}