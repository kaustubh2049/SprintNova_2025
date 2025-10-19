"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Cpu, Flame, ArrowRight } from "lucide-react";

const fests = [
  {
    name: "Spandan",
    tagline: "Cultural Extravaganza",
    description:
      "Experience the vibrant celebration of arts, music, dance, and cultural performances that showcase talent and creativity.",
    icon: Palette,
    gradient: "bg-gradient-to-br from-pink-500/70 to-purple-600/70",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    color: "pink-600",
    events: "20+ Events",
  },
  {
    name: "Transmission",
    tagline: "Technical Innovation",
    description:
      "Dive into the world of technology with coding challenges, robotics, workshops, and innovative tech competitions.",
    icon: Cpu,
    gradient: "bg-gradient-to-br from-blue-500/70 to-cyan-600/70",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    color: "blue-600",
    events: "15+ Events",
  },
  {
    name: "Sparx",
    tagline: "Sports Championship",
    description:
      "Witness athletic excellence across various sports tournaments, showcasing teamwork, skill, and competitive spirit.",
    icon: Flame,
    gradient: "bg-gradient-to-br from-orange-500/70 to-red-600/70",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    color: "orange-600",
    events: "18+ Events",
  },
];

const FestsShowcase = () => {
  return (
    <section id="fests" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Prestigious Fests
          </h2>
          <p className="text-lg text-muted-foreground">
            Three pillars of excellence - Culture, Technology, and Sports. Each
            fest brings unique opportunities to shine and compete.
          </p>
        </div>

        {/* Fests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fests.map((fest, index) => (
            <Card
              key={fest.name}
              className="group overflow-hidden bg-card hover:shadow-strong transition-all duration-500 border-0 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image with Overlay */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={fest.image}
                  alt={fest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 ${fest.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}
                ></div>

                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-medium">
                  <fest.icon className={`w-6 h-6 text-${fest.color}`} />
                </div>

                {/* Event Count Badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-sm font-medium">
                  {fest.events}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {fest.name}
                  </h3>
                  <p className={`text-sm font-medium text-${fest.color}`}>
                    {fest.tagline}
                  </p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {fest.description}
                </p>

                <Button
                  variant="outline"
                  className="w-full group/btn border-2 hover:shadow-medium transition-all"
                >
                  View Events
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestsShowcase;
