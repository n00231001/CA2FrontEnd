import { Outlet } from 'react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import LightPillar from '@/components/LightPillar'

// Root layout: sidebar + header with routed content area
export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* LightPillar background behind everything except sidebar */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{ width: '100%', height: '100%' }}>
          <LightPillar
            topColor="#a7a6aaff"
            bottomColor="#ccccccff"
            intensity={1.0}
            rotationSpeed={0.3}
            glowAmount={0.002}
            pillarWidth={3.0}
            pillarHeight={4}
            noiseIntensity={0}
            pillarRotation={200}
            interactive={true}
            mixBlendMode="darken"
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