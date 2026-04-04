import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  MapPin, 
  Brain, 
  BarChart3, 
  Menu,
  Navigation
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "./ui/utils";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Route Planner', href: '/route-planner', icon: MapPin },
  { name: 'Model Training', href: '/training', icon: Brain },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-1 mt-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Navigation className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TBRGS</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Traffic-based Route Guidance System
            </span>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-6">
        {/* Sidebar */}
        <aside className="hidden md:block sticky top-20">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
