import { motion, useScroll, useTransform } from 'framer-motion';

export default function AnimatedBlobs() {
  const { scrollYProgress } = useScroll();
  
  // Parallax effects for blobs
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const blob1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const blob2Rotate = useTransform(scrollYProgress, [0, 1], [0, -360]);

  return (
    <>
      <motion.div
        className="blob-1"
        style={{
          y: blob1Y,
          rotate: blob1Rotate,
        }}
      />
      <motion.div
        className="blob-2"
        style={{
          y: blob2Y,
          rotate: blob2Rotate,
        }}
      />
    </>
  );
}
