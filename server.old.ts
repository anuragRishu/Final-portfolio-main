import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const db = new Database("portfolio.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const defaultContent = {
  navbar: {
    logo: "A",
    name: "Anurag Chaurasiya",
    resumeUrl: "#",
    items: [
      { name: 'Work', href: '#work' },
      { name: 'Services', href: '#services' },
      { name: 'Skills', href: '#skills' },
      { name: 'Experience', href: '#experience' },
      { name: 'Contact', href: '#contact' },
    ]
  },
  hero: {
    badge: "Professional VFX Artist & Video Editor",
    title: "CRAFTING VISUAL STORIES",
    subtitle: "Transforming raw footage into cinematic experiences. Specializing in high-end VFX, motion graphics, and narrative-driven video editing for global brands and creators.",
    profileImage: "https://picsum.photos/seed/anurag/400/400",
    intro: "Hi, I'm Anurag. I bring stories to life through pixels and motion.",
    primaryBtn: "View Showreel",
    primaryBtnUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    secondaryBtn: "Latest Projects",
    secondaryBtnUrl: "#work",
    colors: {
      accent: "#6366f1",
      gradient: ["#ffffff", "#6366f1", "#a855f7"]
    }
  },
  projects: [
    {
      title: "Cyberpunk Cinematic",
      category: "VFX & Compositing",
      image: "https://picsum.photos/seed/vfx1/800/600",
      youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Brand Identity Reveal",
      category: "Motion Graphics",
      image: "https://picsum.photos/seed/vfx2/800/600",
      youtubeEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    }
  ],
  services: [
    {
      title: "VFX & Compositing",
      description: "High-end visual effects, green screen removal, and seamless multi-layer compositing for film and commercials.",
      price: "Starting at $500",
      icon: "Sparkles"
    },
    {
      title: "Video Editing",
      description: "Narrative-driven editing that tells your story effectively. From YouTube content to professional documentaries.",
      price: "Starting at $300",
      icon: "Scissors"
    }
  ],
  skills: [
    { name: "Adobe After Effects", level: 95, color: "text-purple-400", icon: "Video" },
    { name: "Premiere Pro", level: 90, color: "text-blue-400", icon: "Film" }
  ],
  experience: [
    {
      year: "2023 - Present",
      role: "Senior VFX Artist",
      company: "Creative Studio X",
      description: "Leading visual effects for high-end commercial projects and feature films."
    }
  ],
  contact: {
    title: "LET'S CREATE SOMETHING EPIC",
    email: "ai.anu6261@gmail.com",
    phone: "+91 6261524645",
    location: "Mumbai, India"
  },
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
  }
};

// Seed initial data if empty or update if requested
const count = db.prepare("SELECT count(*) as count FROM content").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO content (key, value) VALUES (?, ?)");
  insert.run("site_data", JSON.stringify(defaultContent));
} else {
  // Force update contact info for this specific request
  const data = db.prepare("SELECT value FROM content WHERE key = ?").get("site_data") as { value: string };
  const currentContent = JSON.parse(data.value);
  currentContent.contact.email = defaultContent.contact.email;
  currentContent.contact.phone = defaultContent.contact.phone;
  
  // Ensure hero fields exist
  if (!currentContent.hero.profileImage) currentContent.hero.profileImage = defaultContent.hero.profileImage;
  if (!currentContent.hero.intro) currentContent.hero.intro = defaultContent.hero.intro;
  if (!currentContent.hero.primaryBtnUrl) currentContent.hero.primaryBtnUrl = defaultContent.hero.primaryBtnUrl;
  if (!currentContent.hero.secondaryBtnUrl) currentContent.hero.secondaryBtnUrl = defaultContent.hero.secondaryBtnUrl;
  
  // Ensure resumeUrl exists
  if (!currentContent.navbar.resumeUrl) {
    currentContent.navbar.resumeUrl = defaultContent.navbar.resumeUrl;
  }
  
  // Ensure socials exist
  if (!currentContent.socials) {
    currentContent.socials = defaultContent.socials;
  }
  
  db.prepare("UPDATE content SET value = ? WHERE key = ?").run(JSON.stringify(currentContent), "site_data");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/content", async (req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('content')
          .select('value')
          .eq('key', 'site_data')
          .single();
        
        if (data) {
          return res.json(JSON.parse(data.value));
        }
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
          console.error('Supabase error:', error);
        }
      }
      
      // Fallback to SQLite
      const data = db.prepare("SELECT value FROM content WHERE key = ?").get("site_data") as { value: string };
      res.json(JSON.parse(data.value));
    } catch (err) {
      console.error('Fetch error:', err);
      // Final fallback to default
      res.json(defaultContent);
    }
  });

  app.post("/api/content", async (req, res) => {
    const contentStr = JSON.stringify(req.body);
    
    // Update SQLite
    const update = db.prepare("UPDATE content SET value = ? WHERE key = ?");
    update.run(contentStr, "site_data");

    // Update Supabase if available
    if (supabase) {
      try {
        const { error } = await supabase
          .from('content')
          .upsert({ key: 'site_data', value: contentStr }, { onConflict: 'key' });
        
        if (error) console.error('Supabase update error:', error);
      } catch (err) {
        console.error('Supabase update catch:', err);
      }
    }
    
    res.json({ success: true });
  });

  // Admin Sync Route: Pushes SQLite data to Supabase
  app.get("/api/admin/supabase-status", (req, res) => {
    res.json({ 
      configured: !!supabase,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : null
    });
  });

  app.post("/api/admin/sync-to-supabase", async (req, res) => {
    if (!supabase) {
      return res.status(400).json({ error: "Supabase not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to your environment variables." });
    }

    try {
      const data = db.prepare("SELECT value FROM content WHERE key = ?").get("site_data") as { value: string };
      const { error } = await supabase
        .from('content')
        .upsert({ key: 'site_data', value: data.value }, { onConflict: 'key' });

      if (error) {
        console.error('Supabase Sync Error:', error);
        throw new Error(error.message + " (Check if RLS is disabled or policy is added)");
      }
      res.json({ success: true, message: "Data successfully pushed to Supabase!" });
    } catch (err: any) {
      console.error('Sync Catch Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (supabase) {
      console.log("✅ Supabase client initialized");
    } else {
      console.log("⚠️ Supabase client NOT initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
  });
}

startServer();
