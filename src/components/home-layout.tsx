import { Outlet } from 'react-router-dom'

interface HomeLayoutProps {
  children?: React.ReactNode
}

function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default HomeLayout 