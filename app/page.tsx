'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Edit, 
  RefreshCw, 
  Zap, 
  Star, 
  Shield, 
  Rocket, 
  Users,
  ArrowRight,
  Check
} from 'lucide-react';

const tools = [
  {
    title: 'Image Editor',
    description: 'Resize, compress, and optimize images with professional quality',
    icon: Edit,
    href: '/editor',
    features: ['Smart resize', 'Quality control', 'Format conversion'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'File Converter',
    description: 'Convert between multiple file formats seamlessly',
    icon: RefreshCw,
    href: '/converter',
    features: ['Multi-format', 'Batch processing', 'Quick conversion'],
    color: 'from-purple-500 to-pink-500',
  },
];

const socialProof = [
  { icon: Users, stat: '50K+', label: 'Active Users' },
  { icon: Zap, stat: '1M+', label: 'Files Processed' },
  { icon: Star, stat: '4.9/5', label: 'User Rating' },
  { icon: Shield, stat: '100%', label: 'Secure' },
];

const howItWorks = [
  { step: '1', title: 'Upload', description: 'Drag & drop your files or click to browse' },
  { step: '2', title: 'Process', description: 'Choose your settings and let our tools work their magic' },
  { step: '3', title: 'Download', description: 'Get your processed files instantly' },
];

const faqItems = [
  {
    question: 'Is my data secure?',
    answer: 'Yes! All files are processed locally in your browser or on secure servers. We never store your files and they are automatically deleted after processing.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'We support JPG, PNG, WebP for images, PDF files, and DOCX documents. Each tool has specific format requirements detailed on their respective pages.',
  },
  {
    question: 'Are there any file size limits?',
    answer: 'Yes, for optimal performance: 10MB for images and 25MB for documents. This ensures fast processing and reliability.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No registration required! All tools are completely free to use without any account creation or sign-up process.',
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 aurora-bg opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-balance"
              >
                All-In-One File Studio
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance"
              >
                Professional image editing, background removal, and file conversion tools. 
                All free, secure, and lightning-fast.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                asChild 
                size="lg" 
                className="focus-ring rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/editor" className="flex items-center space-x-2">
                  <span>Start Creating</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="px-3 py-1">Free Forever</Badge>
                <Badge variant="secondary" className="px-3 py-1">No Registration</Badge>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Tool</h2>
            <p className="text-xl text-muted-foreground">Professional-grade tools for all your file processing needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="glass-card h-full hover:shadow-2xl transition-all duration-300 border-0">
                    <CardContent className="p-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${tool.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{tool.description}</p>
                      
                      <ul className="space-y-2 mb-8">
                        {tool.features.map((feature, featureIndex) => (
                          <motion.li
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index * 0.1) + (featureIndex * 0.05), duration: 0.4 }}
                            className="flex items-center space-x-2"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      
                      <Button 
                        asChild 
                        className="w-full focus-ring rounded-xl group-hover:shadow-lg transition-shadow duration-300"
                      >
                        <Link href={tool.href} className="flex items-center justify-center space-x-2">
                          <span>Open Tool</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {socialProof.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, fast, and professional</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/40">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}