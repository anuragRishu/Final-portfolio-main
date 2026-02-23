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

  useEffect(() => {
    async function loadContent() {
      const { data: row, error } = await supabase
        .from("content")
        .select("value")
        .eq("key", "site_data")
        .single();

      if (error) {
        console.log("Supabase load error → using default");
        setLoading(false);
        return;
      }

      if (row?.value) {
        const parsed =
          typeof row.value === "string"
            ? JSON.parse(row.value)
            : row.value;

        setData(parsed);
      }

      setLoading(false);
    }

    loadContent();
  }, []);

  const updateData = async (newData: SiteData) => {
    setData(newData);

    const { error } = await supabase
      .from("content")
      .upsert({
        key: "site_data",
        value: JSON.stringify(newData),
      });

    if (error) {
      console.error("Save error:", error);
    }
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