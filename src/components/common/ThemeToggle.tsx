import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/theme/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { themeId, setTheme } = useTheme()
  const isDark = themeId.includes('dark')

  const toggleTheme = () => {
    // If using a specific preset (e.g. 'tech-dark'), toggle to its pair ('tech-light')
    // Or fallback to default-light/default-dark
    const currentFamily = themeId.split('-')[0]
    
    // Safety check for legacy 'dark'/'light' strings
    if (currentFamily === 'dark') {
      setTheme('default-light')
      return
    }
    if (currentFamily === 'light') {
      setTheme('default-dark')
      return
    }

    const nextMode = isDark ? 'light' : 'dark'
    const nextTheme = `${currentFamily}-${nextMode}`
    
    setTheme(nextTheme)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 border border-border/50 bg-background/50 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-indigo-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
