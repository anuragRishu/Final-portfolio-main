import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Contact() {
  const { data } = useContent();
  
  if (!data) return null;

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              {data.contact.title.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-indigo-500 italic">{data.contact.title.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-md">
              Ready to take your project to the next level? Get in touch and let's discuss how we can bring your vision to life.
            </p>

            <div className="space-y-8">
              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Email Me</p>
                  <p className="text-xl font-medium">{data.contact.email}</p>
                </div>
              </a>
              
              <a 
                href={`https://wa.me/${data.contact.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">WhatsApp Me</p>
                  <p className="text-xl font-medium">{data.contact.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-xl font-medium">{data.contact.location}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Subject</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                  <option className="bg-zinc-900">VFX Project</option>
                  <option className="bg-zinc-900">Video Editing</option>
                  <option className="bg-zinc-900">Motion Graphics</option>
                  <option className="bg-zinc-900">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <button className="w-full bg-white text-black py-5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group">
                Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
