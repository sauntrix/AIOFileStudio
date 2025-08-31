'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const footerSections = [
  {
    title: 'Image Editor',
    links: [
      { name: 'Resize Images Online – Free Tool', href: '/editor?mode=resize' },
      { name: 'Compress Images Without Losing Quality', href: '/editor?mode=compress' },
    ],
  },
  {
    title: 'File Converter',
    links: [
      { name: 'Convert JPG to PNG or WebP Online', href: '/converter?type=image' },
      { name: 'Convert PDF to Images (JPG/PNG)', href: '/converter?type=pdf-to-image' },
      { name: 'Convert Word to PDF Online', href: '/converter?type=word-to-pdf' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm focus-ring rounded-md p-1 -m-1"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border/40"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span>© 2025 All-In-One File Studio. Built with ❤️ for creators.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}