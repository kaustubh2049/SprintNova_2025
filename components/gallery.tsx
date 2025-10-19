"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Play, Eye } from "lucide-react";

const galleryItems = [
  {
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    title: "Spandan 2024 - Grand Finale",
    type: "Cultural",
    gradient: "bg-gradient-to-br from-pink-500/70 to-purple-600/70",
  },
  {
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    title: "Transmission - Robotics Challenge",
    type: "Technical",
    gradient: "bg-gradient-to-br from-blue-500/70 to-cyan-600/70",
  },
  {
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    title: "Sparx - Athletics Championship",
    type: "Sports",
    gradient: "bg-gradient-to-br from-green-500/70 to-emerald-600/70",
  },
  {
    image:
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
    title: "Dance Competition Highlights",
    type: "Cultural",
    gradient: "bg-gradient-to-br from-pink-500/70 to-purple-600/70",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    title: "Hackathon Winners",
    type: "Technical",
    gradient: "bg-gradient-to-br from-blue-500/70 to-cyan-600/70",
  },
  {
    image:
      "https://images.unsplash.com/photo-1530915365347-e35b749a0381?w=800&q=80",
    title: "Cricket Tournament Finals",
    type: "Sports",
    gradient: "bg-gradient-to-br from-green-500/70 to-emerald-600/70",
  },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Event Memories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Moments of Glory
          </h2>
          <p className="text-lg text-muted-foreground">
            Relive the excitement and achievements from our spectacular events
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-card border-0 shadow-soft hover:shadow-strong transition-all duration-500 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 ${item.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-300`}
                ></div>

                {/* Hover Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-3">
                    <button className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-strong hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5 text-primary" />
                    </button>
                    <button className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-strong hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-primary ml-1" />
                    </button>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {item.type}
                </div>
              </div>

              {/* Title */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-medium px-8"
          >
            <ImageIcon className="mr-2 w-5 h-5" />
            View Complete Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
