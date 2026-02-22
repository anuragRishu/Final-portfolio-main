import { motion } from 'motion/react';
import { Scissors, Sparkles, Box, Share2, Video, Film, Palette, Cpu, Layers, Monitor } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap: Record<string, any> = {
  Sparkles, Scissors, Box, Share2, Video, Film, Palette, Cpu, Layers, Monitor
};

export default function Services() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">SERVICES</h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Tailored solutions for your visual needs. High quality, fast turnaround, and creative excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="p-5 rounded-3xl bg-indigo-600/10 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon size={32} />
                  </div>
                  <span className="text-sm font-bold text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-full">
                    {service.price}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/40 leading-relaxed mb-8">
                  {service.description}
                </p>
                <button className="text-sm font-bold flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                  Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
