"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";const imagesList = [
  "/game-photos/1.webp",
  "/game-photos/2.webp",
  "/game-photos/3.webp",
  "/game-photos/4.webp",
  "/game-photos/5.webp",
  "/game-photos/6.webp",
  "/game-photos/7.webp",
  "/game-photos/8.webp",
  "/game-photos/9.webp",
  "/game-photos/10.webp",
  "/game-photos/11.webp",
  "/game-photos/12.webp",
  "/game-photos/13.webp",
  "/game-photos/14.webp",
  "/game-photos/15.webp",
  "/game-photos/16.webp",
  "/game-photos/17.webp",
  "/game-photos/18.webp",
];



const imagePairs = imagesList.flatMap(img => [img, img]);

const shuffleArray = (array: string[]) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({ handleShowProposal }: ValentinesProposalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    setShuffledImages(shuffleArray(imagePairs));
  }, []);

  const handleClick = async (index: number) => {
    if (selected.length === 2 || matched.includes(index) || selected.includes(index)) return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (shuffledImages[firstIndex] === shuffledImages[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 800);
        setTimeout(() => setSelected([]), 800);
      }
    } else {
      setSelected([index]);
    }
  };

  useEffect(() => {
    if (matched.length === imagePairs.length) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal]);

  if (shuffledImages.length === 0) return null; // Prevent hydration mismatch

  return (
    <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
      <div className="hidden">
        {shuffledImages.map((image, i) => (
          <Image key={i} src={image} alt={`Image ${i + 1}`} fill className="object-cover" />
        ))}
      </div>

      {heartLayout.flat().map((index, i) =>
        index !== null ? (
          <motion.div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => handleClick(index)}
            style={{ perspective: "1000px" }}
          >
            {!selected.includes(index) && !matched.includes(index) && (
              <motion.div
                className="w-full h-full bg-gray-300 rounded-sm lg:rounded-md absolute z-10"
                style={{ backfaceVisibility: "hidden" }}
              />
            )}

            {(selected.includes(index) || matched.includes(index)) && (
              <motion.div
                className="w-full h-full absolute"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={shuffledImages[index]}
                  alt={`Image ${index + 1}`}
                  fill
                  className="rounded-sm lg:rounded-md object-cover"
                />
              </motion.div>
            )}

            {incorrect.includes(index) && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-red-500 rounded-sm lg:rounded-md" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />
        ),
      )}
    </div>
  );
}
