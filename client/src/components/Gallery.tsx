import { motion } from "framer-motion";
import gallery1 from "@assets/gallery1_1752306166982.jpg";
import gallery2 from "@assets/DSC06930_1752306166981.jpg";
import gallery3 from "@assets/about-debudant_1752306166981.jpg";
import gallery4 from "@assets/DSC07066_1752306166982.jpg";
import gallery5 from "@assets/gallery12_1752306166982.jpg";
import gallery6 from "@assets/gallery10_1752306166983.jpg";
import gallery7 from "@assets/gallery7_1752306166983.jpg";
import gallery8 from "@assets/gallery11_1752306166983.jpg";

const galleryImages = [
  { src: gallery1, alt: "Gwyneth - Portrait 1" },
  { src: gallery2, alt: "Gwyneth - Portrait 2" },
  { src: gallery3, alt: "Gwyneth - Portrait 3" },
  { src: gallery4, alt: "Gwyneth - Portrait 4" },
  { src: gallery5, alt: "Gwyneth - Portrait 5" },
  { src: gallery6, alt: "Gwyneth - Portrait 6" },
  { src: gallery7, alt: "Gwyneth - Portrait 7" },
  { src: gallery8, alt: "Gwyneth - Portrait 8" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12 text-center"
          >
            Gallery
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-3xl shadow-2xl border-4 border-gold cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <p className="font-lora text-white text-sm">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="font-lora text-soft-lilac text-lg mt-12 text-center"
          >
            Gwyneth's journey to adulthood captured in beautiful moments
          </motion.p>
        </div>
      </div>
    </section>
  );
}