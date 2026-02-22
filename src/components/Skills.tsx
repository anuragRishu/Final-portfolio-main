import { motion } from 'motion/react';
import { 
  Video, 
  Layers, 
  Zap, 
  Monitor, 
  Cpu, 
  Palette,
  Film,
  Camera
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap: Record<string, any> = {
  Video, Layers, Zap, Monitor, Cpu, Palette, Film, Camera
};

export default function Skills() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <section id="skills" className="py-24 px-6 md:px-12 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">TECHNICAL ARSENAL</h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Mastering the industry's leading tools to deliver world-class visual content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((skill, index) => {
            const Icon = iconMap[skill.icon] || Video;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-white/5 ${skill.color}`}>
                    <Icon size={32} />
                  </div>
                  <span className="text-3xl font-bold text-white/20 group-hover:text-white/100 transition-colors">
                    {skill.level}%
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4">{skill.name}</h3>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
