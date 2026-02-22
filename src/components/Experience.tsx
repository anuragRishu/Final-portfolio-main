import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

export default function Experience() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <section id="experience" className="py-24 px-6 md:px-12 bg-zinc-950">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 text-center">JOURNEY</h2>
          
          <div className="space-y-12">
            {data.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-0 md:grid md:grid-cols-[1fr_2px_2fr] gap-12"
              >
                {/* Desktop Year */}
                <div className="hidden md:block text-right pt-1">
                  <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm">{exp.year}</span>
                </div>

                {/* Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 md:relative md:left-auto md:top-auto md:bottom-auto">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-600 border-4 border-zinc-950" />
                </div>

                {/* Content */}
                <div className="pb-12 md:pb-16">
                  <span className="md:hidden block text-indigo-500 font-bold tracking-widest uppercase text-xs mb-2">{exp.year}</span>
                  <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                  <p className="text-white/60 font-medium mb-4">{exp.company}</p>
                  <p className="text-white/40 leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
