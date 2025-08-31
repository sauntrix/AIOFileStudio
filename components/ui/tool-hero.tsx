'use client';

import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ToolHeroProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badges?: string[];
}

export function ToolHero({ title, description, icon: Icon, badges = [] }: ToolHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 mb-6"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
      >
        {title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto text-balance"
      >
        {description}
      </motion.p>
      
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            >
              <Badge variant="secondary" className="px-3 py-1">
                {badge}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}