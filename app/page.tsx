"use client";

import Link from "next/link";
import {
  Calendar,
  Trophy,
  Image as ImageIcon,
  FileText,
  ArrowRight,
} from "lucide-react";
import CircularGallery from "@/components/CircularGallery";
import SpotlightCard from "@/components/SpotlightCard";
import Hero from "@/components/hero";
import Gallery from "@/components/gallery";
import Footer from "@/components/footer";
import FestsShowcase from "@/components/fest";

export default function Home() {
  const cards = [
    {
      href: "/events",
      title: "Events",
      description: "Explore upcoming and past events organized by the council.",
      icon: Calendar,
      color: "#3b82f6", // blue
      bgClass:
        "bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 backdrop-blur-xl border border-blue-500/20",
    },
    {
      href: "/standings",
      title: "Standings",
      description: "Check house-wise points and leaderboards across fests.",
      icon: Trophy,
      color: "#10b981", // green
      bgClass:
        "bg-gradient-to-br from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20 backdrop-blur-xl border border-green-500/20",
    },
    {
      href: "/gallery",
      title: "Gallery",
      description: "Relive moments from XIE events through photos.",
      icon: ImageIcon,
      color: "#a855f7", // purple
      bgClass:
        "bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 backdrop-blur-xl border border-purple-500/20",
    },
    {
      href: "/drafts",
      title: "Notices",
      description: "Read official notices and announcements.",
      icon: FileText,
      color: "#f97316", // orange
      bgClass:
        "bg-gradient-to-br from-orange-500/20 to-orange-600/10 dark:from-orange-500/30 dark:to-orange-600/20 backdrop-blur-xl border border-orange-500/20",
    },
  ];

  return (
    <>
      {/* Hero Section with Stats */}
      <Hero />

      {/* Fests Showcase Section */}
      <FestsShowcase />

      {/* Circular Gallery Section - Edge to Edge */}
      <section className="w-full bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Memories That Last Forever
            </h2>
            <p className="text-lg text-muted-foreground">
           
            </p>
          </div>
        </div>
        <div className="w-full h-[600px] md:h-[700px]">
          <CircularGallery
            items={[
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.24.06_d60c6742.jpg",
                text: "Cultural Night",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.24.08_a8cec1dc.jpg",
                text: "Concert",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_36e345de.jpg",
                text: "Dance Performance",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_ab1dbd5f.jpg",
                text: "Tech Fest",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_473908fb.jpg",
                text: "Sports Day",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_65d7fb79.jpg",
                text: "Celebrations",
              },
              {
                image: "/images/home_events/WhatsApp Image 2025-10-18 at 16.27.42_850db995.jpg",
                text: "Award Ceremony",
              },
            ]}
            bend={2.5}
            textColor="hsl(var(--foreground))"
            borderRadius={0.08}
            scrollSpeed={2.5}
            scrollEase={0.08}
          />
        </div>
      </section>

      {/* Interactive Cards Section - Navigation */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Navigate to your desired section quickly
          </p>
        </div>
        <section className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            // Convert hex to rgba with better opacity
            const hexToRgba = (hex: string, alpha: number) => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            return (
              <Link key={card.href} href={card.href} className="group block">
                <SpotlightCard
                  className="h-full min-h-[280px] transition-all duration-300 hover:scale-[1.02]"
                  spotlightColor={hexToRgba(card.color, 0.4) as any}
                >
                  <div className="flex flex-col h-full justify-center">
                    <div
                      className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border group-hover:scale-110 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(
                          card.color,
                          0.2
                        )} 0%, ${hexToRgba(card.color, 0.05)} 100%)`,
                        borderColor: hexToRgba(card.color, 0.3),
                        boxShadow: `0 0 20px ${hexToRgba(card.color, 0.2)}`,
                      }}
                    >
                      <Icon className="h-8 w-8" style={{ color: card.color }} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-between text-foreground">
                      {card.title}
                      <ArrowRight
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                        style={{ color: card.color }}
                      />
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </section>
      </div>

      {/* Gallery Section */}
      <Gallery />

      {/* Footer */}
      <Footer />
    </>
  );
}
