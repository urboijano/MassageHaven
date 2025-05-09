
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PolicyLayoutProps {
  children: ReactNode;
  title: string;
}

export default function PolicyLayout({ children, title }: PolicyLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-8">{title}</h1>
          <div className="prose max-w-none">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
