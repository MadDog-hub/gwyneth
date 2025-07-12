import { useState, useEffect, useRef } from "react";
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

import qrGift from "@assets/qr-gift_1752306166980.jpg";
import aboutDebutant from "@assets/about-debudant_1752306166981.jpg";
import dresscodeWomen from "@assets/dresscode-woman_1752306166979.png";
import dresscodeMen from "@assets/dresscode-men_1752306166979.jpg";
import locationImage from "@assets/location_1752306166980.webp";

import Untitled_design from "@assets/Untitled design.png";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"invitation" | "main">("invitation");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const transitionToMainPage = () => {
    setCurrentPage("main");
    // Start music after user interaction (clicking the button)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().then(() => {
          setMusicPlaying(true);
          console.log("Music started successfully");
        }).catch(error => {
          console.log("Audio play failed:", error);
        });
      }
    }, 1000);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
    setVideoPlaying(true);
    // Pause music when video starts
    if (audioRef.current && musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  };

  const handleStopVideo = () => {
    setShowVideo(false);
    setVideoPlaying(false);
    // Resume music when video is stopped
    if (audioRef.current && !musicPlaying) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
      }).catch(error => {
        console.log("Audio play failed:", error);
      });
    }
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

                <h2 className="font-script text-3xl md:text-5xl font-bold text-royal-blue mb-4">
                  Gwyneth
                </h2>

                <h3 className="font-cinzel text-xl md:text-2xl font-semibold text-royal-blue mb-6">
                  A Decade and Eight
                </h3>

                <div className="space-y-3 mb-8 text-slate-gray">
                  <p className="font-opensans">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    August 30, 2025 • 6:00 PM
                  </p>
                  <p className="font-opensans">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    THE BARN: Rustic Corner Bar & Grill
                  </p>
                </div>

                <p className="font-lora text-sm text-slate-gray mb-8 italic">
                  "Where music meets the heart in perfect harmony"
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
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onError={() => console.log("Audio failed to load")}
        onLoadStart={() => console.log("Audio loading started")}
        onCanPlay={() => console.log("Audio ready to play")}
        onPlay={() => console.log("Audio started playing")}
        style={{ display: 'none' }}
      >
        <source src="/attached_assets/ytmp3free.cc_golden-hour-jvke-string-orchestra-cover-by-vivid-strings-youtubemp3free.org_1752306166980.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Navigation scrollToSection={scrollToSection} />
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="text-center z-10 relative max-w-4xl mx-auto px-4 bg-[#ffffff]">
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
            className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-[#3c83f6e6]"
          >
            A Decade and Eight
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-lora text-xl md:text-2xl mb-8 text-[#3c83f6e6]"
          >
            A Musical Journey Celebration
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-4 mb-12"
          >
            <p className="font-opensans text-lg text-slate-gray">
              <Calendar className="inline w-6 h-6 mr-2 text-gold" />
              August 30, 2025 at 6:00 PM
            </p>
            <p className="font-opensans text-lg text-slate-gray">
              <MapPin className="inline w-6 h-6 mr-2 text-gold" />
              THE BARN: Rustic Corner Bar & Grill
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <CountdownTimer targetDate="2025-08-30T18:00:00" />
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-[#3c83f6e6]"
            >
              About <span className="font-script">Gwyneth</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-12"
            >
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <Music className="w-16 h-16 text-[#D9C2EB]" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <img 
                    src={aboutDebutant} 
                    alt="Lea Gwyneth"
                    className="w-full h-96 object-cover rounded-2xl shadow-lg border-4 border-gold"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="font-opensans text-lg leading-relaxed mb-6 text-[#E78BA5]">
                    Lea <span className="font-script text-xl">Gwyneth</span>, a thoughtful and passionate 18-year-old, has long held a deep appreciation for music and its ability to inspire, heal, and connect. Though not a musician herself, she finds meaning and emotion in melodies, lyrics, and rhythms that speak to the heart.
                  </p>
                  <p className="font-opensans text-lg leading-relaxed mb-6 text-[#E78BA5]">
                    Her love for music is reflected in the way she curates soundtracks to match moments in life, drawing strength, comfort, and joy from each note. To her, music is more than entertainment—it's a powerful expression of human experience, and a constant companion on her personal journey.
                  </p>
                  <p className="font-opensans text-lg leading-relaxed text-[#E78BA5]">
                    At the heart of her story are her parents, whose unwavering support and love have shaped the person she is today. Their guidance, encouragement, and belief in her dreams have given her the confidence to grow, explore her passions, and face life with grace and purpose.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <RSVPForm />
      <section id="location" className="py-20 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-[#3c83f6e6]"
            >
              Celebration Venue
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-12"
            >
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-12 h-12 text-[#D9C2EB]" />
                </div>
              </div>

              <h3 className="font-lora text-2xl mb-4 text-[#e78ba5]">THE BARN: Rustic Corner Bar & Grill</h3>

              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-gold mb-6">
                <img 
                  src={locationImage} 
                  alt="THE BARN: Rustic Corner Bar & Grill"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className="bg-gold text-royal-blue font-semibold btn-3d hover:scale-105 transition-all duration-300"
                >
                  <a 
                    href="https://www.google.com/maps/search/THE+BARN+Rustic+Corner+Bar+%26+Grill" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-[#3c83f6e6]"
            >
              Dress Code
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12 bg-[#ffffff]"
            >
              <p className="font-opensans text-xl text-slate-gray mb-8 leading-relaxed text-center">
                <strong>Formal Attire</strong><br />
                We invite you to dress elegantly for this special celebration.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <h3 className="font-lora text-2xl text-royal-blue mb-4">For Women</h3>
                  <div className="mb-6">
                    <img 
                      src={Untitled_design} 
                      alt="Women's Dress Code - Formal Dresses"
                      className="w-full h-auto object-contain rounded-2xl shadow-lg border-4 border-gold"
                    />
                  </div>
                  <p className="font-opensans text-slate-gray">
                    <strong>Formal dress</strong><br />
                    Elegant evening gowns, cocktail dresses, or sophisticated formal wear.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-lora text-2xl text-royal-blue mb-4">For Men</h3>
                  <div className="mb-6">
                    <img 
                      src={dresscodeMen} 
                      alt="Men's Dress Code - Tuxedo, Suit, Slacks"
                      className="w-full h-auto object-contain rounded-2xl shadow-lg border-4 border-gold"
                    />
                  </div>
                  <p className="font-opensans text-slate-gray">
                    <strong>Tuxedo, suit, slacks</strong><br />
                    Formal evening wear with dress shirts and ties or bow ties.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#FDCFA0' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Peach Cream</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#FAF096' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Light Yellow</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#89A7C2' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Dusty Blue</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#F8C6CC' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Blush Pink</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#E78BA5' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Mauve Pink</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full" style={{ backgroundColor: '#D9C2EB' }}></div>
                  <p className="font-opensans text-sm text-slate-gray">Lavender</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border-l-4 border-red-500">
                <p className="font-opensans text-red-800 font-semibold text-center">
                  <strong>Important:</strong> Strictly no jeans
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-[#3c83f6e6]"
            >
              Message from Parents
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12 bg-[#ffffff]"
            >
              <p className="font-opensans text-lg leading-relaxed italic text-[#E78BA5]">
                "We are incredibly proud of our daughter <span className="font-script text-xl">Gwyneth</span> and the beautiful young woman she has become. This debutante celebration marks a significant milestone in her life as she steps into adulthood with grace, passion, and dreams. Her love for music and the way it touches her heart reminds us daily of the wonderful person she is. We invite you to join us in celebrating this special moment as she begins this new chapter of her journey."
              </p>

              <div className="mt-8">
                <p className="font-lora text-xl text-soft-lilac">
                  — Gwyneth's Loving Parents
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-[#3c83f6e6]"
            >
              Event Timeline
            </motion.h2>

            <div className="space-y-6">
              {[
                { time: "5:30 PM", event: "Guests Arrive", icon: Calendar },
                { time: "6:00 PM", event: "Ceremony Begins", icon: Crown },
                { time: "7:00 PM", event: "Dinner & Speeches", icon: Calendar },
                { time: "10:00 PM", event: "Dancing & Farewell", icon: Music },
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
        <div className="w-full px-4">
          <div className="w-full text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cinzel text-4xl md:text-5xl font-bold mb-8 text-[#3c83f6e6]"
            >
              Debut Prenup Video
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              {showVideo && (
                <div className="flex justify-end mb-4 px-4">
                  <Button
                    onClick={handleStopVideo}
                    className="bg-red-600 hover:bg-red-700 text-white z-10"
                    size="sm"
                  >
                    Stop Video
                  </Button>
                </div>
              )}

              <div className="w-full h-[70vh] md:h-[80vh] overflow-hidden shadow-lg border-4 border-gold rounded-2xl">
                {!showVideo ? (
                  <div 
                    className="w-full h-full bg-gradient-to-br from-royal-blue/20 to-soft-lilac/20 flex items-center justify-center cursor-pointer group"
                    onClick={handlePlayVideo}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-royal-blue ml-1" />
                      </div>
                      <p className="font-lora text-[#D9C2EB] text-lg">Play Debut Prenup Video</p>
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src="https://www.youtube.com/embed/X8QRsbMD5C0?controls=1"
                    className="w-full h-full" 
                    frameBorder="0" 
                    allowFullScreen
                    title="Debut Prenup Video"
                  />
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-8 text-[#3c83f6e6]"
            >
              Gift Registry
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-3xl p-8 md:p-12 bg-[#ffffff]"
            >
              <div className="mb-8">
                <Crown className="w-16 h-16 text-gold mx-auto" />
              </div>

              <p className="font-opensans text-lg mb-8 text-[#E78BA5]">
                With all that we have, we've been truly blessed.<br/>
                Your presence and prayers are all that we request.<br/>
                But if you desire to give nonetheless,<br/>
                a monetary gift is one we suggest.
              </p>

              <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-xs md:max-w-md mx-auto border-2 border-soft-lilac">
                <div className="w-full max-w-[240px] md:max-w-[280px] mx-auto">
                  <img 
                    src={qrGift} 
                    alt="Payment QR Code for Lea Gwyneth Basco"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
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
              className="font-cinzel text-4xl md:text-5xl font-bold mb-12 text-center text-[#3c83f6e6]"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-4">
              {[
                {
                  question: "What time should I arrive?",
                  answer: "Please arrive by 5:30 PM to ensure you don't miss any part of the celebration."
                },
                {
                  question: "Is parking available?",
                  answer: "Yes, parking is available at THE BARN: Rustic Corner Bar & Grill."
                },
                {
                  question: "Can I bring a plus-one?",
                  answer: "Please check your invitation for plus-one details, or contact us directly."
                },
                {
                  question: "What should I wear?",
                  answer: "Formal attire is required. Women should wear formal dresses, men should wear tuxedos, suits, or slacks. Strictly no jeans."
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
                  className="bg-white rounded-2xl p-6"
                >
                  <details className="group">
                    <summary className="font-lora text-lg text-royal-blue cursor-pointer list-none flex justify-between items-center">
                      <span>{faq.question}</span>
                      <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-opensans text-slate-gray">{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <GuestbookForm />
      <footer className="py-12 relative gradient-green-blue">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <Crown className="w-12 h-12 text-gold mx-auto" />
            </div>

            <h3 className="font-cinzel text-2xl text-[#3c83f6e6] mb-4"><span className="font-script">Gwyneth's</span> Debutante Ball</h3>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex items-center">
                <span className="font-opensans text-[#3c83f6e6]">For inquiries visit rsvpblisscreations.site</span>
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
                  className="text-[#3c83f6e6] hover:text-gold transition-colors font-opensans"
                >
                  {item.label}
                </button>
              ))}
            </div>



            <Button
              asChild
              variant="ghost"
              className="text-[#3c83f6e6] bg-[#fdf791] text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              <a href="/admin">Admin</a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}