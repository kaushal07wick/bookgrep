"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AuroraBackground } from "@/app/components/ui/aurora-background";
import { Audiowide  } from "next/font/google";
import { PlaceholdersAndInput } from "@/app/components/ui/placeholders-and-input";
import Image from "next/image";


const audiowide = Audiowide({
  weight: '400',  // Use the appropriate weight
  subsets: ['latin'],  // Specify subsets
  variable: '--font-audiowide',  // Optional: for variable fonts
});

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const placeholders = [
    "Search all to see all the available books",
    "Read any digitally available book!",
    "What do you feel like reading today?",
    "Search a book to read..."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <AuroraBackground>
     
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className={`${audiowide.className} flex items-center gap-4 text-5xl md:text-7xl font-bold dark:text-white text-center`}>
        <Image
          src="/books.webp"
          alt="Description of the image"
          width={150} // Set width
          height={150} // Set height
        />
          <span>Book Grep</span>
        </div>

        <PlaceholdersAndInput
        value={search}
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      </motion.div>
    </AuroraBackground>
  );
}
