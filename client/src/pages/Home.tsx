import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, MapPin, Calendar, Music, Play, Pause, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThreeBackground from "@/components/ThreeBackground";
import CountdownTimer from "@/components/CountdownTimer";
import Gallery from "@/components/Gallery";
import RSVPForm from "@/components/RSVPForm";
import GuestbookForm from "@/components/GuestbookForm";
import Navigation from "@/components/Navigation";

import gcash from "@assets/gcash.jpg";

import aboutme from "@assets/aboutme.jpg";

import dresscode from "@assets/dresscode.jpg";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"invitation" | "main">("invitation");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const transitionToMainPage = () => {
    setCurrentPage("main");
    setTimeout(() => setMusicPlaying(true), 1000);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
    setVideoPlaying(true);
  };

  const handleStopVideo = () => {
    setShowVideo(false);
    setVideoPlaying(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  if (currentPage === "invitation") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center">
        <ThreeBackground scene="invitation" />

        <div className="relative w-full max-w-4xl aspect-[4/3]">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg shadow-2xl border-2 border-amber-400">
            <div className="absolute inset-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg"></div>
          </div>

          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -45 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-amber-300 to-amber-400 origin-bottom border-2 border-amber-400 rounded-t-lg"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-red-600 rounded-full border-4 border-red-700 flex items-center justify-center">
              <Crown className="w-8 h-8 text-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: -20, opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
            className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-xl border border-gold/30"
          >
            <div className="text-center h-full flex flex-col justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-red-500 mr-2" />
                  <Mail className="w-12 h-12 text-gold" />
                  <Heart className="w-8 h-8 text-red-500 ml-2" />
                </div>

                <h1 className="font-cinzel text-2xl md:text-4xl font-bold text-royal-blue mb-4">
                  You're Invited
                </h1>

                <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>

                <h2 className="font-cinzel text-xl md:text-2xl font-semibold text-royal-blue mb-6">
                  Erica Santos' Grand Celebration
                </h2>

                <div className="space-y-3 mb-8 text-slate-gray">
                  <p className="font-opensans">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    July 20, 2025 • 6:00 PM
                  </p>
                  <p className="font-opensans">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Royal Gardens Estate
                  </p>
                </div>

                <p className="font-lora text-sm text-slate-gray mb-8 italic">
                  "Where art meets elegance in perfect harmony"
                </p>

                <Button
                  onClick={transitionToMainPage}
                  className="bg-royal-blue text-white font-opensans font-semibold px-6 py-3 btn-3d hover:scale-105 transition-all duration-300"
                >
                  Open Invitation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ThreeBackground scene="main" />
      <div className="fixed bottom-8 right-8 z-50 glass-effect rounded-full p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMusic}
          className="text-gold hover:text-white transition-colors"
        >
          {musicPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>
      {musicPlaying && (
        <iframe
          src="https://www.youtube.com/embed/woLcQL-RaRU?autoplay=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          className="hidden"
          allow="autoplay"
        />
      )}
      <Navigation scrollToSection={scrollToSection} />
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

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-lora text-xl md:text-2xl text-soft-lilac mb-8"
          >
            A Royal Garden Celebration
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-4 mb-12"
          >
            <p className="font-opensans text-lg text-slate-gray">
              <Calendar className="inline w-6 h-6 mr-2 text-gold" />
              July 20, 2025 at 6:00 PM
            </p>
            <p className="font-opensans text-lg text-slate-gray">
              <MapPin className="inline w-6 h-6 mr-2 text-gold" />
              Royal Gardens Estate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <CountdownTimer targetDate="2025-07-20T18:00:00" />
          </motion.div>
        </div>
      </section>
      <section id="about" className="py-20 relative gradient-garden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-12"
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
                <div className="w-20 h-20 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <Crown className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <img 
                    src={aboutme} 
                    alt="Erica Santos"
                    className="w-full h-96 object-contain rounded-2xl shadow-lg border-4 border-gold"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="font-opensans text-lg text-white leading-relaxed mb-6">
                    Erica Santos, a passionate 25-year-old artist from Manila, has always found inspiration in the natural world around her. Her love for painting landscapes, flowers, and garden scenes reflects her deep connection with nature's beauty.
                  </p>
                  <p className="font-opensans text-lg text-white leading-relaxed mb-6">
                    Born into a family that appreciates art and creativity, Erica developed her artistic talents from a young age. She specializes in watercolor paintings that capture the delicate essence of gardens, blooming flowers, and serene natural settings.
                  </p>
                  <p className="font-opensans text-lg text-white leading-relaxed">
                    Her dream of a garden-themed celebration stems from her belief that life, like a garden, blooms most beautifully when nurtured with love, care, and the right conditions. This magnificent royal garden celebration represents the culmination of her artistic vision, where art meets elegance in perfect harmony.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section id="dresscode" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12"
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
              <div className="mb-8">
                <div className="w-64 h-auto mx-auto mb-6">
                  <img 
                    src={dresscode} 
                    alt="Dress Code Illustration"
                    className="w-full h-auto object-contain rounded-2xl shadow-lg border-4 border-gold"
                  />
                </div>
              </div>
              
              <p className="font-opensans text-xl text-slate-gray mb-8 leading-relaxed">
                <strong>Formal Garden Attire</strong><br />
                We invite you to dress elegantly in celebration colors that complement our royal garden theme.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <h3 className="font-lora text-2xl text-royal-blue mb-4">For Ladies</h3>
                  <p className="font-opensans text-slate-gray">
                    Elegant cocktail dresses, formal gowns, or sophisticated separates in celebration colors. 
                    Floral patterns and garden-inspired accessories are welcome.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-lora text-2xl text-royal-blue mb-4">For Gentlemen</h3>
                  <p className="font-opensans text-slate-gray">
                    Business formal or cocktail attire - suits with dress shirts and ties. 
                    Pocket squares in celebration colors are encouraged.
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-lora text-2xl text-royal-blue mb-6">Celebration Color Palette</h3>
                <div className="flex justify-center flex-wrap gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-800 rounded-full border-4 border-white shadow-lg mx-auto mb-3"></div>
                    <p className="font-opensans text-sm font-semibold text-slate-gray">Royal Blue</p>
                    <p className="font-opensans text-xs text-slate-gray">#1E3A8A</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-sky-300 rounded-full border-4 border-white shadow-lg mx-auto mb-3"></div>
                    <p className="font-opensans text-sm font-semibold text-slate-gray">Sky Blue</p>
                    <p className="font-opensans text-xs text-slate-gray">#93C5FD</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-pink-300 rounded-full border-4 border-white shadow-lg mx-auto mb-3"></div>
                    <p className="font-opensans text-sm font-semibold text-slate-gray">Soft Lilac</p>
                    <p className="font-opensans text-xs text-slate-gray">#F9A8D4</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full border-4 border-white shadow-lg mx-auto mb-3"></div>
                    <p className="font-opensans text-sm font-semibold text-slate-gray">Gold</p>
                    <p className="font-opensans text-xs text-slate-gray">#FFD700</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-600 rounded-full border-4 border-white shadow-lg mx-auto mb-3"></div>
                    <p className="font-opensans text-sm font-semibold text-slate-gray">Slate Gray</p>
                    <p className="font-opensans text-xs text-slate-gray">#6B7280</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-royal-blue/10 rounded-2xl p-6 border-l-4 border-royal-blue">
                <p className="font-opensans text-slate-gray italic">
                  <strong>Note:</strong> Please avoid wearing white, ivory, or cream as these colors are reserved for the celebrant. 
                  We encourage garden-inspired accessories like floral jewelry or botanical prints.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section id="message" className="py-20 relative gradient-garden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12"
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
              <p className="font-opensans text-lg text-slate-gray leading-relaxed italic">
                "We are incredibly proud of our daughter Erica and her artistic achievements. This celebration marks not just another year of her life, but the blossoming of her talents and dreams. We invite you to join us in celebrating the beautiful person she has become and the bright future that lies ahead."
              </p>

              <div className="mt-8">
                <p className="font-lora text-xl text-soft-lilac">
                  — Mr. & Mrs. Santos
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
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
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-start space-x-4 shadow-lg border border-gold/20"
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
      <Gallery />
      <section id="video" className="py-20 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-8"
            >
              Debut Prenup Video
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-gold relative">
                {!showVideo ? (
                  <div 
                    className="w-full h-full bg-gradient-to-br from-royal-blue/20 to-soft-lilac/20 flex items-center justify-center cursor-pointer group"
                    onClick={handlePlayVideo}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-royal-blue ml-1" />
                      </div>
                      <p className="font-lora text-white text-lg">Play Debut Prenup Video</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <iframe 
                      src="https://www.youtube.com/embed/Us5WiFfhvIk?controls=1"
                      className="w-full h-full" 
                      frameBorder="0" 
                      allowFullScreen
                      title="Debut Prenup Video"
                    />
                    <Button
                      onClick={handleStopVideo}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      Stop Video
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
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
                <div className="w-64 h-auto mx-auto">
                  <img 
                    src={gcash} 
                    alt="GCash QR Code"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
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
                  className="glass-effect rounded-2xl p-6"
                >
                  <details className="group">
                    <summary className="font-lora text-lg text-white cursor-pointer list-none flex justify-between items-center">
                      <span>{faq.question}</span>
                      <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="font-opensans text-white/90">{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RSVPForm />
      <GuestbookForm />
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