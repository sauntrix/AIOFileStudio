'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Edit, RefreshCw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Image Editor', href: '/editor', icon: Edit },
  { name: 'File Converter', href: '/converter', icon: RefreshCw },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus-ring rounded-lg p-1"
              aria-label="All-In-One File Studio Home"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                AIS
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Button 
                    asChild 
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "focus-ring rounded-xl transition-all duration-200",
                      isActive && "shadow-lg"
                    )}
                  >
                    <Link href={item.href} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}