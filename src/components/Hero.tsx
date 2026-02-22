import { motion } from 'motion/react';
import { Play, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Left Side: Profile Photo */}
          {data.hero.profileImage && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative flex-shrink-0"
            >
              <div className="absolute inset-0 bg-indigo-600/20 rounded-[3rem] blur-3xl animate-pulse" />
              <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-[3rem] overflow-hidden border-2 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <img 
                  src={data.hero.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
            </motion.div>
          )}

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left max-w-3xl"
          >
            {data.hero.intro && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-indigo-400 font-medium tracking-wide text-lg md:text-xl mb-4"
              >
                {data.hero.intro}
              </motion.p>
            )}

            <span className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase border border-white/10 rounded-full bg-white/5 backdrop-blur-sm text-white/60">
              {data.hero.badge}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]">
              {data.hero.title.split(' ').slice(0, -2).join(' ')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-400 to-purple-500">
                {data.hero.title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-12 font-light leading-relaxed max-w-2xl lg:mx-0 mx-auto">
              {data.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-6">
              <a 
                href={data.hero.primaryBtnUrl || '#'} 
                target={data.hero.primaryBtnUrl?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group relative px-10 py-5 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:pr-14 w-full sm:w-auto text-center"
              >
                <span className="relative z-10">{data.hero.primaryBtn}</span>
                <Play className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} fill="currentColor" />
              </a>
              
              <a 
                href={data.hero.secondaryBtnUrl || '#'} 
                className="flex items-center gap-2 px-8 py-4 text-white font-bold hover:text-indigo-400 transition-colors"
              >
                {data.hero.secondaryBtn} <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scroll</span>
      </motion.div>
    </section>
  );
}
