import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, MapPin, Calendar, Music, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThreeBackground from "@/components/ThreeBackground";
import CountdownTimer from "@/components/CountdownTimer";
import Gallery from "@/components/Gallery";
import RSVPForm from "@/components/RSVPForm";
import GuestbookForm from "@/components/GuestbookForm";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"invitation" | "main">("invitation");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const transitionToMainPage = () => {
    setCurrentPage("main");
    // Auto-start music after transition
    setTimeout(() => setMusicPlaying(true), 1000);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    setShowMobileMenu(false);
  };

  if (currentPage === "invitation") {
    return (
      <div className="min-h-screen gradient-royal flex items-center justify-center relative overflow-hidden">
        <ThreeBackground scene="invitation" />
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="rotating absolute top-10 left-10 text-6xl text-soft-lilac/30">
            <Crown />
          </div>
          <div className="floating delay-300 absolute top-20 right-20 text-4xl text-gold/40">
            <Crown />
          </div>
          <div className="rotating delay-700 absolute bottom-40 left-1/4 text-5xl text-soft-lilac/25">
            <Crown />
          </div>
        </div>

        {/* Invitation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="card-3d floating z-10"
        >
          <Card className="max-w-md mx-4 border-4 border-gold bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gold to-soft-lilac rounded-full flex items-center justify-center mb-6">
                  <Crown className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="font-cinzel text-4xl font-bold text-royal-blue mb-6 text-shadow">
                You Are Invited!
              </h1>
              
              <h2 className="font-lora text-2xl text-soft-lilac mb-8">
                Erica Santos' Grand Celebration
              </h2>
              
              <Button
                onClick={transitionToMainPage}
                className="btn-3d bg-gradient-to-r from-royal-blue to-soft-lilac text-white px-8 py-4 rounded-full font-lora text-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Click to Enter
              </Button>
              
              <div className="mt-8 flex justify-center space-x-4">
                <Crown className="w-6 h-6 text-soft-lilac rotating" />
                <Crown className="w-5 h-5 text-gold" />
                <Crown className="w-6 h-6 text-soft-lilac rotating delay-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ThreeBackground scene="main" />
      
      {/* Music Player */}
      <div className="music-player glass-effect rounded-full p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMusic}
          className="text-gold hover:text-white transition-colors"
        >
          {musicPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>

      {/* Hidden YouTube iframe for music */}
      {musicPlaying && (
        <iframe
          src="https://www.youtube.com/embed/woLcQL-RaRU?autoplay=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          className="hidden"
          allow="autoplay"
        />
      )}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 glass-effect border-b border-gold/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="font-cinzel text-xl font-bold text-white">
              <Crown className="inline w-6 h-6 mr-2 text-gold" />
              Erica's Celebration
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6">
              {[
                { label: "Home", id: "hero" },
                { label: "About", id: "about" },
                { label: "Timeline", id: "timeline" },
                { label: "Gallery", id: "gallery" },
                { label: "RSVP", id: "rsvp" },
                { label: "Guestbook", id: "guestbook" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-gold transition-colors font-opensans"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
              </div>
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 space-y-2"
            >
              {[
                { label: "Home", id: "hero" },
                { label: "About", id: "about" },
                { label: "Timeline", id: "timeline" },
                { label: "Gallery", id: "gallery" },
                { label: "RSVP", id: "rsvp" },
                { label: "Guestbook", id: "guestbook" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-white hover:text-gold transition-colors font-opensans py-2"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="text-center z-10 relative max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-12 h-12 text-gold" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold text-royal-blue mb-4 text-shadow"
          >
            Erica Santos' Grand Celebration
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-lora text-2xl md:text-3xl text-soft-lilac mb-8"
          >
            July 20, 2025
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-8"
          >
            <CountdownTimer targetDate="2025-07-20T18:00:00" />
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-lora text-lg md:text-xl text-slate-gray mb-6 italic max-w-2xl mx-auto border-l-4 border-gold pl-6"
          >
            "The Lord is my shepherd; I shall not want." - Psalm 23:1
          </motion.blockquote>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-opensans text-lg text-slate-gray max-w-xl mx-auto"
          >
            Step into a royal garden of joy and love
          </motion.p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="rotating absolute top-20 left-10 text-6xl text-soft-lilac/30">
            <Crown />
          </div>
          <div className="floating delay-500 absolute top-40 right-20 text-4xl text-gold/40">
            <Crown />
          </div>
          <div className="rotating delay-1000 absolute bottom-40 left-1/4 text-5xl text-soft-lilac/25">
            <Crown />
          </div>
        </div>
      </section>

      {/* About Erica Section */}
      <section id="about" className="py-20 relative gradient-garden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-8"
            >
              About Erica
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12"
            >
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-soft-lilac to-gold rounded-full flex items-center justify-center">
                  <Crown className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <p className="font-opensans text-lg text-white leading-relaxed">
                Erica Santos, a 25-year-old artist from Manila, loves painting nature and dreams of a garden-themed celebration. Her artistic vision and love for natural beauty have inspired this magnificent royal garden celebration, where art meets elegance in perfect harmony.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Message from Parents Section */}
      <section id="message" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-8"
            >
              Message from Parents
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12"
            >
              <div className="mb-8">
                <Crown className="w-16 h-16 text-soft-lilac mx-auto" />
              </div>
              
              <blockquote className="font-lora text-xl text-slate-gray italic leading-relaxed mb-4">
                "Our dearest Erica, your journey has filled us with pride. Celebrate this day with the love you've always shared."
              </blockquote>
              
              <p className="font-opensans text-lg text-slate-gray">- Mom & Dad</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="dresscode" className="py-20 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-8"
            >
              Dress Code
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12"
            >
              <p className="font-opensans text-lg text-white mb-8">
                Formal garden attire in our celebration colors. Women: elegant dresses, Men: suits with ties
              </p>
              
              {/* Color Palette Display */}
              <div className="flex justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-royal-blue rounded-full border-4 border-white shadow-lg mx-auto"></div>
                  <p className="font-opensans text-sm text-slate-gray mt-2">Royal Blue</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-soft-lilac rounded-full border-4 border-white shadow-lg mx-auto"></div>
                  <p className="font-opensans text-sm text-slate-gray mt-2">Soft Lilac</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold rounded-full border-4 border-white shadow-lg mx-auto"></div>
                  <p className="font-opensans text-sm text-slate-gray mt-2">Gold</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Timeline Section */}
      <section id="timeline" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12"
            >
              Event Timeline
            </motion.h2>
            
            <div className="space-y-6">
              {[
                { time: "5:30 PM", event: "Guests Arrive", icon: Calendar },
                { time: "6:00 PM", event: "Ceremony Begins", icon: Crown },
                { time: "7:00 PM", event: "Dinner & Speeches", icon: Calendar },
                { time: "9:00 PM", event: "Dancing & Farewell", icon: Music },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-2xl p-6 flex items-center justify-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-lora text-xl text-soft-lilac">{item.time}</h3>
                    <p className="font-opensans text-slate-gray">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Event Video Section */}
      <section id="video" className="py-20 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-8"
            >
              Event Video
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-gold">
                <iframe 
                  src="https://www.youtube.com/embed/samplevideo" 
                  className="w-full h-full" 
                  frameBorder="0" 
                  allowFullScreen
                  title="Event Video"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      <section id="gifts" className="py-20 relative gradient-garden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-8"
            >
              Gift Registry
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12"
            >
              <div className="mb-8">
                <Crown className="w-16 h-16 text-gold mx-auto" />
              </div>
              
              <p className="font-opensans text-lg text-white mb-8">
                Your presence is the greatest gift, but if you'd like to contribute, we'd appreciate art supplies or cash gifts.
              </p>
              
              <div className="bg-white rounded-2xl p-6 max-w-md mx-auto border-2 border-soft-lilac">
                <h3 className="font-lora text-xl text-soft-lilac mb-4">GCash Payment</h3>
                <div className="w-48 h-48 mx-auto bg-slate-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-300 rounded-lg mx-auto mb-2"></div>
                    <p className="font-opensans text-sm text-slate-gray">GCash QR Code</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section id="maps" className="py-20 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-8">Ceremony Location</h2>
                <div className="glass-effect rounded-3xl p-6">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-slate-gray mx-auto mb-2" />
                      <p className="font-opensans text-slate-gray mb-4">Royal Gardens Estate - Ceremony</p>
                      <Button
                        asChild
                        className="bg-royal-blue text-white btn-3d"
                      >
                        <a href="https://maps.app.goo.gl/RoyalGardensCeremony" target="_blank" rel="noopener noreferrer">
                          View on Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-8">Reception Location</h2>
                <div className="glass-effect rounded-3xl p-6">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-slate-gray mx-auto mb-2" />
                      <p className="font-opensans text-slate-gray mb-4">Royal Gardens Estate - Reception</p>
                      <Button
                        asChild
                        className="bg-royal-blue text-white btn-3d"
                      >
                        <a href="https://maps.app.goo.gl/RoyalGardensReception" target="_blank" rel="noopener noreferrer">
                          View on Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative gradient-garden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-12 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="space-y-4">
              {[
                {
                  question: "What time should I arrive?",
                  answer: "Please arrive by 5:30 PM to ensure you don't miss any part of the ceremony."
                },
                {
                  question: "Is parking available?",
                  answer: "Yes, complimentary parking is available at the Royal Gardens Estate."
                },
                {
                  question: "Can I bring a plus-one?",
                  answer: "Please check your invitation for plus-one details, or contact us directly."
                },
                {
                  question: "Do I need to bring a gift?",
                  answer: "Your presence is enough, but gifts are welcome if you'd like to contribute."
                },
                {
                  question: "What time does the event end?",
                  answer: "The celebration will conclude around 10:00 PM."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-2xl overflow-hidden"
                >
                  <details className="group">
                    <summary className="cursor-pointer p-6 font-lora text-xl text-royal-blue hover:bg-white/5 transition-colors">
                      <span>{faq.question}</span>
                    </summary>
                    <div className="p-6 pt-0 font-opensans text-slate-gray">
                      {faq.answer}
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <RSVPForm />

      {/* Digital Guestbook Section */}
      <GuestbookForm />

      {/* Footer */}
      <footer className="py-12 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <Crown className="w-12 h-12 text-gold mx-auto" />
            </div>
            
            <h3 className="font-cinzel text-2xl text-white mb-4">Erica Santos' Grand Celebration</h3>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex items-center">
                <span className="font-opensans text-white">ericasantos@gmail.com</span>
              </div>
              <div className="flex items-center">
                <span className="font-opensans text-white">0918-654-3210</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6 mb-8">
              {[
                { label: "Home", id: "hero" },
                { label: "About", id: "about" },
                { label: "Timeline", id: "timeline" },
                { label: "Gallery", id: "gallery" },
                { label: "RSVP", id: "rsvp" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-gold transition-colors font-opensans"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <p className="font-opensans text-sm text-white mb-4">
              Domain: ericasantoscelebration.com
            </p>
            
            <Button
              asChild
              variant="ghost"
              className="text-gold text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              <a href="/admin">Admin</a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
