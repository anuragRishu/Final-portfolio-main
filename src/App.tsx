/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';
import PasswordModal from './components/PasswordModal';
import { ContentProvider } from './context/ContentContext';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleAdminSuccess = () => {
    setIsPasswordModalOpen(false);
    setIsAdminOpen(true);
  };

  return (
    <ContentProvider>
      <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white">
        <Navbar onAdminClick={() => setIsPasswordModalOpen(true)} />
        <main>
          <Hero />
          <Projects />
          <Services />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
        <AIChat />
        
        <AnimatePresence>
          {isPasswordModalOpen && (
            <PasswordModal 
              onSuccess={handleAdminSuccess}
              onClose={() => setIsPasswordModalOpen(false)}
            />
          )}
          {isAdminOpen && (
            <AdminPanel onClose={() => setIsAdminOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </ContentProvider>
  );
}
