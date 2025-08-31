'use client';

import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function BackgroundRemoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="glass-card">
            <CardContent className="p-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 mb-6 flex items-center justify-center mx-auto">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Background Remover</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                This feature has been temporarily removed from the application. 
                Please use our other available tools for your file processing needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="focus-ring rounded-xl">
                  <Link href="/editor">
                    Try Image Editor
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="focus-ring rounded-xl">
                  <Link href="/converter">
                    Try File Converter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}