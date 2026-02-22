import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <footer className="py-12 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
              {data.navbar.logo}
            </div>
            <span className="font-semibold tracking-tight">{data.navbar.name}</span>
          </div>

          <div className="flex items-center gap-6">
            {data.socials?.github && (
              <a href={data.socials.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            )}
            {data.socials?.linkedin && (
              <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            )}
            {data.socials?.twitter && (
              <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            )}
            {data.socials?.instagram && (
              <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            )}
            <a href={`mailto:${data.contact.email}`} className="text-white/40 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>

          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} {data.navbar.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
