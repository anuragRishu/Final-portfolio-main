import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Play, Volume2, VolumeX, X, Info } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Projects() {
  const { data } = useContent();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});
  const projectRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (window.innerWidth < 1024) { // Mobile/Tablet check
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number(entry.target.getAttribute('data-index'));
              setMobileActiveIndex(index);
            }
          });
        }
      },
      { threshold: 0.6 }
    );

    Object.values(projectRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [data]);

  if (!data) return null;

  const activeIndex = isMobile ? mobileActiveIndex : hoveredIndex;

  const toggleMute = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const iframe = iframeRefs.current[index];
    if (iframe && iframe.contentWindow) {
      const command = isMuted ? 'unMute' : 'mute';
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-black">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">SELECTED WORK</h2>
            <p className="text-white/40 max-w-md">
              A curated collection of projects where I've pushed the boundaries of visual storytelling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, index) => (
            <motion.div
              key={index}
              ref={(el) => { projectRefs.current[index] = el; }}
              data-index={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer"
            >
              {/* Thumbnail */}
              <img 
                src={project.image} 
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-700 brightness-110 contrast-110 ${activeIndex === index ? 'opacity-0 scale-110' : 'opacity-100'}`}
                referrerPolicy="no-referrer"
              />

              {/* YouTube Embed on Hover/Scroll */}
              {activeIndex === index && project.youtubeEmbedUrl && (
                <div className="absolute inset-0 z-10">
                  <iframe
                    ref={(el) => { iframeRefs.current[index] = el; }}
                    className="w-full h-full pointer-events-none scale-150"
                    src={`${project.youtubeEmbedUrl}${project.youtubeEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&rel=0&showinfo=0&enablejsapi=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title={project.title}
                  />
                  <button 
                    onClick={(e) => toggleMute(e, index)}
                    className="absolute bottom-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all pointer-events-auto"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              )}
              
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-indigo-400 text-sm font-medium mb-2">{project.category}</span>
                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                <div className="flex gap-4">
                  <div className="p-3 bg-white text-black rounded-full hover:bg-indigo-500 hover:text-white transition-colors">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div className="p-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                    <Info size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-auto max-h-[90vh]"
            >
              {/* Video Area */}
              <div className="w-full lg:w-[70%] aspect-video bg-black relative flex-shrink-0">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`${selectedProject.youtubeEmbedUrl}${selectedProject.youtubeEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&mute=0&rel=0&playsinline=1&enablejsapi=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={selectedProject.title}
                />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 left-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all lg:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Details Area */}
              <div className="flex-1 p-8 md:p-12 flex flex-col bg-zinc-900 overflow-y-auto">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">
                      {selectedProject.category}
                    </span>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors hidden lg:block"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <h2 className="text-4xl font-bold mb-6">{selectedProject.title}</h2>
                  <div className="space-y-6 text-white/60 leading-relaxed">
                    <p>
                      {selectedProject.description || "This project showcases advanced post-production techniques including seamless compositing, dynamic motion graphics, and professional color grading."}
                    </p>
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Client</span>
                        <span className="text-sm font-medium">Global Brand X</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Software</span>
                        <span className="text-sm font-medium">After Effects, Premiere Pro</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Year</span>
                        <span className="text-sm font-medium">2024</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <button className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group">
                    View Case Study <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
