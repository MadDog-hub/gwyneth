import { motion } from "framer-motion";
import gallery1 from "@assets/gallery1_1749267337389.jpg";
import gallery2 from "@assets/gallery2_1749267337388.jpg";
import gallery3 from "@assets/gallery3_1749267337387.jpg";
import gallery4 from "@assets/gallery4_1749267342786.jpg";
import gallery5 from "@assets/gallery5_1749267342785.jpg";
import gallery6 from "@assets/gallery6_1749267342785.jpg";
import gallery7 from "@assets/gallery7_1749267342783.jpg";
import gallery8 from "@assets/gallery9_1749269284528.jpg";

const galleryImages = [
  { src: gallery1, alt: "Erica Santos - Portrait 1" },
  { src: gallery2, alt: "Erica Santos - Portrait 2" },
  { src: gallery3, alt: "Erica Santos - Portrait 3" },
  { src: gallery4, alt: "Erica Santos - Portrait 4" },
  { src: gallery5, alt: "Erica Santos - Portrait 5" },
  { src: gallery6, alt: "Erica Santos - Portrait 6" },
  { src: gallery7, alt: "Erica Santos - Portrait 7" },
  { src: gallery8, alt: "Erica Santos - Portrait 8" },
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
            Erica's artistic journey captured in moments
          </motion.p>
        </div>
      </div>
    </section>
  );
}