"use client";

import {
  Trophy,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">
                  XIE Fests
                </span>
                <span className="text-xs text-background/70">
                  Xavier Institute of Engineering
                </span>
              </div>
            </div>
            <p className="text-sm text-background/80">
              Celebrating excellence in culture, technology, and sports.
              Official fest management platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#fests"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Our Fests
                </a>
              </li>
              <li>
                <a
                  href="#leaderboard"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Leaderboard
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Fests */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Fests</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Spandan - Cultural
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Transmission - Technical
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Sparx - Sports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Event Schedule
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-background/70" />
                <span className="text-background/80">
                  Xavier Institute of Engineering, Mumbai, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-background/70" />
                <a
                  href="mailto:fests@xie.edu.in"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  fests@xie.edu.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-background/70" />
                <a
                  href="tel:+912226708000"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  +91 22 2670 8000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          {/* Social Links */}
          <div className="flex gap-4 justify-center">
            <a
              href="#"
              className="w-9 h-9 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright - Separate Section */}
      <div className="bg-background/5 mt-8 py-4">
        <div className="container mx-auto px-4">
          <p className="text-sm text-background/70 text-center">
            © 2025 Xavier Institute of Engineering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
