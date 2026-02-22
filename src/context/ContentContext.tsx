import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { defaultContent } from "../lib/defaultContent";

export interface SiteData {
  navbar: {
    logo: string;
    name: string;
    resumeUrl?: string;
    items: { name: string; href: string }[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    profileImage?: string;
    intro?: string;
    primaryBtn: string;
    primaryBtnUrl?: string;
    secondaryBtn: string;
    secondaryBtnUrl?: string;
    colors: {
      accent: string;
      gradient: string[];
    };
  };
  projects: {
    title: string;
    category: string;
    image: string;
    youtubeEmbedUrl: string;
    description?: string;
  }[];
  services: {
    title: string;
    description: string;
    price: string;
    icon: string;
  }[];
  skills: {
    name: string;
    level: number;
    color: string;
    icon: string;
  }[];
  experience: {
    year: string;
    role: string;
    company: string;
    description: string;
  }[];
  contact: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

interface ContentContextType {
  data: SiteData | null;
  updateData: (newData: SiteData) => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(defaultContent);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD FROM SUPABASE (replaces GET /api/content)
  useEffect(() => {
    async function loadContent() {
      const { data: row } = await supabase
        .from("content")
        .select("value")
        .eq("key", "site_data")
        .single();

      if (row?.value) {
        setData(row.value);
      }
      setLoading(false);
    }

    loadContent();
  }, []);

  // 🔥 SAVE TO SUPABASE (replaces POST /api/content)
  const updateData = async (newData: SiteData) => {
    setData(newData);

    await supabase
      .from("content")
      .upsert({ key: "site_data", value: newData });
  };

  return (
    <ContentContext.Provider value={{ data, updateData, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}