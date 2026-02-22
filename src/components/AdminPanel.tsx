import { useState, useEffect } from 'react';
import { useContent, SiteData } from '../context/ContentContext';
import { X, Save, Plus, Trash2, ChevronRight, ChevronDown, Database as DbIcon, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { data, updateData } = useContent();
  const [localData, setLocalData] = useState<SiteData | null>(data);
  const [activeSection, setActiveSection] = useState<string | null>('hero');
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'missing'>('checking');

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const response = await fetch('/api/admin/supabase-status');
        const result = await response.json();
        if (result.configured) {
          setSupabaseStatus('connected');
        } else {
          setSupabaseStatus('missing');
        }
      } catch (err) {
        setSupabaseStatus('missing');
      }
    };
    checkSupabase();
  }, []);

  if (!localData) return null;

  const handleSave = async () => {
    await updateData(localData);
    onClose();
  };

  const handleSyncToSupabase = async () => {
    if (!confirm("This will push your current preview data to Supabase. Make sure you have configured SUPABASE_URL and SUPABASE_ANON_KEY in your Render environment variables. Continue?")) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/admin/sync-to-supabase', {
        method: 'POST',
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert("Sync failed: " + result.error);
      }
    } catch (err) {
      alert("Sync error: " + (err as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateField = (section: keyof SiteData, field: string, value: any) => {
    setLocalData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      };
    });
  };

  const updateArrayItem = (section: keyof SiteData, index: number, field: string, value: any) => {
    setLocalData(prev => {
      if (!prev) return null;
      const newArray = [...(prev[section] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: keyof SiteData, defaultItem: any) => {
    setLocalData(prev => {
      if (!prev) return null;
      return { ...prev, [section]: [...(prev[section] as any[]), defaultItem] };
    });
  };

  const removeArrayItem = (section: keyof SiteData, index: number) => {
    setLocalData(prev => {
      if (!prev) return null;
      const newArray = [...(prev[section] as any[])];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const SectionHeader = ({ id, title }: { id: string, title: string }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? null : id)}
      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors mb-2"
    >
      <span className="font-bold uppercase tracking-widest text-sm">{title}</span>
      {activeSection === id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
    >
      <div className="bg-zinc-900 border border-white/10 w-full max-w-4xl h-full max-h-[90vh] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-zinc-950">
          <div>
            <h2 className="text-2xl font-bold">Admin Control</h2>
            <p className="text-white/40 text-sm">Customize your portfolio content</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${supabaseStatus === 'connected' ? 'bg-green-500' : supabaseStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Supabase: {supabaseStatus}
              </span>
            </div>
            <button 
              onClick={handleSyncToSupabase}
              disabled={isSyncing || supabaseStatus !== 'connected'}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-4 py-2.5 rounded-full text-sm font-bold transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              title={supabaseStatus === 'connected' ? "Push local data to Supabase" : "Supabase not configured in AI Studio Secrets"}
            >
              {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <DbIcon size={16} />}
              Sync to Supabase
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold transition-all"
            >
              <Save size={18} /> Save Changes
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
          
          {supabaseStatus === 'missing' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
              <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                <Info size={16} /> Supabase is not configured in this preview.
              </p>
              <p className="text-white/40 text-xs mt-1">
                To sync your data, you must add <code className="text-white/60">SUPABASE_URL</code> and <code className="text-white/60">SUPABASE_ANON_KEY</code> to the <b>Secrets</b> panel in AI Studio.
              </p>
            </div>
          )}

          {/* Navbar Section */}
          <SectionHeader id="navbar" title="Navigation Bar" />
          <AnimatePresence>
            {activeSection === 'navbar' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Logo Initial</label>
                    <input value={localData.navbar.logo} onChange={e => updateField('navbar', 'logo', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Display Name</label>
                    <input value={localData.navbar.name} onChange={e => updateField('navbar', 'name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Resume Download URL</label>
                  <input value={localData.navbar.resumeUrl || ''} onChange={e => updateField('navbar', 'resumeUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" placeholder="https://example.com/resume.pdf" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <SectionHeader id="hero" title="Hero Section" />
          <AnimatePresence>
            {activeSection === 'hero' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Profile Image URL</label>
                    <input value={localData.hero.profileImage || ''} onChange={e => updateField('hero', 'profileImage', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Intro Text</label>
                    <input value={localData.hero.intro || ''} onChange={e => updateField('hero', 'intro', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Badge Text</label>
                  <input value={localData.hero.badge} onChange={e => updateField('hero', 'badge', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Main Title</label>
                  <input value={localData.hero.title} onChange={e => updateField('hero', 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Subtitle</label>
                  <textarea value={localData.hero.subtitle} onChange={e => updateField('hero', 'subtitle', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Primary Button Text</label>
                    <input value={localData.hero.primaryBtn} onChange={e => updateField('hero', 'primaryBtn', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Primary Button URL</label>
                    <input value={localData.hero.primaryBtnUrl || ''} onChange={e => updateField('hero', 'primaryBtnUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Secondary Button Text</label>
                    <input value={localData.hero.secondaryBtn} onChange={e => updateField('hero', 'secondaryBtn', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Secondary Button URL</label>
                    <input value={localData.hero.secondaryBtnUrl || ''} onChange={e => updateField('hero', 'secondaryBtnUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Section */}
          <SectionHeader id="projects" title="Selected Work" />
          <AnimatePresence>
            {activeSection === 'projects' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-6 pb-4">
                {localData.projects.map((project, idx) => (
                  <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 relative">
                    <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Title</label>
                        <input value={project.title} onChange={e => updateArrayItem('projects', idx, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Category</label>
                        <input value={project.category} onChange={e => updateArrayItem('projects', idx, 'category', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Thumbnail URL</label>
                        <input value={project.image} onChange={e => updateArrayItem('projects', idx, 'image', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">YouTube Embed Link</label>
                        <input value={project.youtubeEmbedUrl} onChange={e => updateArrayItem('projects', idx, 'youtubeEmbedUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Description (for Popup)</label>
                      <textarea value={project.description || ''} onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none" placeholder="Describe the project details..." />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('projects', { title: 'New Project', category: 'VFX', image: 'https://picsum.photos/800/600', youtubeEmbedUrl: '', description: '' })}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-indigo-500 transition-all"
                >
                  <Plus size={20} /> Add New Project
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Services Section */}
          <SectionHeader id="services" title="Services" />
          <AnimatePresence>
            {activeSection === 'services' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-6 pb-4">
                {localData.services.map((service, idx) => (
                  <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 relative">
                    <button onClick={() => removeArrayItem('services', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Service Title</label>
                        <input value={service.title} onChange={e => updateArrayItem('services', idx, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Price Label</label>
                        <input value={service.price} onChange={e => updateArrayItem('services', idx, 'price', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Description</label>
                      <textarea value={service.description} onChange={e => updateArrayItem('services', idx, 'description', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none" />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('services', { title: 'New Service', description: '', price: 'Starting at $0', icon: 'Sparkles' })}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-indigo-500 transition-all"
                >
                  <Plus size={20} /> Add New Service
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skills Section */}
          <SectionHeader id="skills" title="Skills" />
          <AnimatePresence>
            {activeSection === 'skills' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                {localData.skills.map((skill, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                    <input value={skill.name} onChange={e => updateArrayItem('skills', idx, 'name', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="Skill Name" />
                    <input type="number" value={skill.level} onChange={e => updateArrayItem('skills', idx, 'level', parseInt(e.target.value))} className="w-20 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="%" />
                    <button onClick={() => removeArrayItem('skills', idx)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('skills', { name: 'New Skill', level: 80, color: 'text-blue-400', icon: 'Zap' })} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-white/40 hover:text-white transition-all">
                  + Add Skill
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experience Section */}
          <SectionHeader id="experience" title="Experience" />
          <AnimatePresence>
            {activeSection === 'experience' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                {localData.experience.map((exp, idx) => (
                  <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 relative">
                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 text-red-500 p-2"><Trash2 size={18} /></button>
                    <div className="grid grid-cols-2 gap-4">
                      <input value={exp.year} onChange={e => updateArrayItem('experience', idx, 'year', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Year Range" />
                      <input value={exp.role} onChange={e => updateArrayItem('experience', idx, 'role', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Role" />
                    </div>
                    <input value={exp.company} onChange={e => updateArrayItem('experience', idx, 'company', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Company" />
                    <textarea value={exp.description} onChange={e => updateArrayItem('experience', idx, 'description', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm resize-none" placeholder="Description" />
                  </div>
                ))}
                <button onClick={() => addArrayItem('experience', { year: '2024', role: 'VFX Artist', company: 'Freelance', description: '' })} className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-sm text-white/40 hover:text-white transition-all">
                  + Add Experience
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Section */}
          <SectionHeader id="contact" title="Contact Info" />
          <AnimatePresence>
            {activeSection === 'contact' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Contact Title</label>
                  <input value={localData.contact.title} onChange={e => updateField('contact', 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email</label>
                    <input value={localData.contact.email} onChange={e => updateField('contact', 'email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Phone</label>
                    <input value={localData.contact.phone} onChange={e => updateField('contact', 'phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</label>
                  <input value={localData.contact.location} onChange={e => updateField('contact', 'location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Socials Section */}
          <SectionHeader id="socials" title="Social Media Links" />
          <AnimatePresence>
            {activeSection === 'socials' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">GitHub URL</label>
                    <input value={localData.socials?.github || ''} onChange={e => updateField('socials', 'github', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">LinkedIn URL</label>
                    <input value={localData.socials?.linkedin || ''} onChange={e => updateField('socials', 'linkedin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Twitter URL</label>
                    <input value={localData.socials?.twitter || ''} onChange={e => updateField('socials', 'twitter', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Instagram URL</label>
                    <input value={localData.socials?.instagram || ''} onChange={e => updateField('socials', 'instagram', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}
