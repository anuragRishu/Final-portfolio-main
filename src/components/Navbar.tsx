import { motion } from 'motion/react';
import { Github, Linkedin, Download } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Navbar({ onAdminClick }: { onAdminClick: () => void }) {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/20"
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={onAdminClick}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
          {data.navbar.logo}
        </div>
        <span className="font-semibold tracking-tight hidden sm:block">{data.navbar.name}</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {data.navbar.items.map((item) => (
          <a 
            key={item.name} 
            href={item.href}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            {item.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {data.socials?.github && (
          <a href={data.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors">
            <Github size={20} />
          </a>
        )}
        {data.socials?.linkedin && (
          <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
        )}
        <a 
          href={data.navbar.resumeUrl || '#'} 
          download 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
        >
          Resume <Download size={16} />
        </a>
      </div>
    </motion.nav>
  );
}
