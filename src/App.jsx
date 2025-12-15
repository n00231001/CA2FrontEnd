import { Outlet } from 'react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import Waves from '@/components/Waves'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Root layout: sidebar + header with routed content area
export default function AppLayout() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isLight = mounted && currentTheme === 'light'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Waves background behind everything except sidebar */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{ width: '100%', height: '100%' }}>
          <Waves
            lineColor={isLight ? '#000000' : '#64748b'}
            backgroundColor={isLight ? '#ffffff' : 'transparent'}
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={22}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        

        <AppSidebar />
        <main className="relative z-10 flex flex-1 flex-col">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}