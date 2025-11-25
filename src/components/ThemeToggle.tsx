import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeState } from "@/hooks/useTheme"

export function ThemeToggle() {
  const { theme, setTheme } = useThemeState()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${theme === "dark" || theme === "system" ? "-rotate-90 scale-0" : ""}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${theme === "dark" ? "rotate-0 scale-100" : ""} ${theme === "system" ? "-rotate-90 scale-0" : ""}`} />
      <Monitor className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${theme === "system" ? "rotate-0 scale-100" : ""}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}