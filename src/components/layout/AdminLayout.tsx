import { ReactNode, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-[72px]'}`}>
        <header className="sticky top-0 z-20 h-16 bg-card border-b border-border flex items-center px-8 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary rounded-lg lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-heading-md text-foreground">{title}</h1>
        </header>
        <main className="p-8 max-w-[1280px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
