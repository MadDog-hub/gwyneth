import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gallery1 from "@assets/gallery1_1749267337389.jpg";
import gallery2 from "@assets/gallery2_1749267337388.jpg";
import gallery3 from "@assets/gallery3_1749267337387.jpg";
import gallery4 from "@assets/gallery4_1749267342786.jpg";
import gallery5 from "@assets/gallery5_1749267342785.jpg";
import gallery6 from "@assets/gallery6_1749267342785.jpg";
import gallery7 from "@assets/gallery7_1749267342783.jpg";

const galleryImages = [
  { src: gallery1, alt: "Erica Santos - Portrait 1" },
  { src: gallery2, alt: "Erica Santos - Portrait 2" },
  { src: gallery3, alt: "Erica Santos - Portrait 3" },
  { src: gallery4, alt: "Erica Santos - Portrait 4" },
  { src: gallery5, alt: "Erica Santos - Portrait 5" },
  { src: gallery6, alt: "Erica Santos - Portrait 6" },
  { src: gallery7, alt: "Erica Santos - Portrait 7" },
];

export default function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12"
          >
            Gallery
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-gold">
              <div className="aspect-video md:aspect-[16/10]">
                {galleryImages.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-contain card-3d transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: index === currentSlide ? 1 : 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gold/80 text-royal-blue hover:bg-gold btn-3d"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gold/80 text-royal-blue hover:bg-gold btn-3d"
                onClick={nextSlide}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gold scale-125' 
                        : 'bg-soft-lilac/50 hover:bg-soft-lilac/80'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <p className="font-lora text-soft-lilac text-lg mt-6">
              Erica's artistic journey captured in moments
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
