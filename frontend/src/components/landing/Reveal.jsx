import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 36, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const LineReveal = ({ lines, className = "", delay = 0.3 }) => (
  <span className={className}>
    {lines.map((ln, i) => (
      <span key={i} className="reveal-mask">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.85, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {ln}
        </motion.span>
      </span>
    ))}
  </span>
);
