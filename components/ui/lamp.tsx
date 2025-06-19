"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Color palette reference:
// Jet Black:      #0B0B0B (bg-main)
// Charcoal Black: #121212 (cards/containers)
// Matte Black:    #1A1A1A (inputs)
// Vivid Purple:   #A259FF (primary accent)
// Electric Purple:#B478FF (hover accent)
// Royal Purple:   #802EFF (deep/active)
// Text:           #F0E6FF (primary)
// Borders:        #5C2E91 (outline)

export const LampContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex min-h-screen flex-col items-center justify-start overflow-hidden w-full rounded-md z-0 px-2 sm:px-4",
                className
            )}
            style={{ background: "#0B0B0B" }} // Jet Black
        >
            {/* Lamp Animation with responsive height/margin */}
            <div className="relative w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-72 sm:mt-4 md:mt-6 flex items-center justify-center isolate z-0">
                {/* Left Lamp Glow */}
                <motion.div
                    initial={{ opacity: 0.5, width: "10rem" }}
                    whileInView={{ opacity: 1, width: "20rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto right-1/2 h-32 xs:h-40 sm:h-56 md:h-56 overflow-visible w-[16rem] xs:w-[20rem] sm:w-[24rem] md:w-[30rem] 
            bg-gradient-conic from-[#A259FF] via-transparent to-transparent text-[#F0E6FF] [--conic-position:from_70deg_at_center_top]"
                >
                    <div className="absolute w-full left-0 bg-[#0B0B0B] h-24 xs:h-32 sm:h-40 md:h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                    <div className="absolute w-24 xs:w-32 h-full left-0 bg-[#0B0B0B] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
                </motion.div>
                {/* Right Lamp Glow */}
                <motion.div
                    initial={{ opacity: 0.5, width: "10rem" }}
                    whileInView={{ opacity: 1, width: "20rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto left-1/2 h-32 xs:h-40 sm:h-56 md:h-56 w-[16rem] xs:w-[20rem] sm:w-[24rem] md:w-[30rem] 
            bg-gradient-conic from-transparent via-transparent to-[#A259FF] text-[#F0E6FF] [--conic-position:from_290deg_at_center_top]"
                >
                    <div className="absolute w-24 xs:w-32 h-full right-0 bg-[#0B0B0B] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
                    <div className="absolute w-full right-0 bg-[#0B0B0B] h-24 xs:h-32 sm:h-40 md:h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                </motion.div>
                {/* Lamp base and glows */}
                <div className="absolute top-1/2 h-24 xs:h-32 sm:h-48 w-full translate-y-8 xs:translate-y-12 scale-x-150 bg-[#0B0B0B] blur-2xl"></div>
                <div className="absolute top-1/2 z-50 h-24 xs:h-32 sm:h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
                <div className="absolute inset-auto z-50 h-20 xs:h-28 sm:h-36 w-[14rem] xs:w-[18rem] sm:w-[28rem] -translate-y-1/2 rounded-full bg-[#A259FF] opacity-50 blur-3xl"></div>
                <motion.div
                    initial={{ width: "6rem" }}
                    whileInView={{ width: "12rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-auto z-30 h-20 xs:h-28 sm:h-36 w-32 xs:w-40 sm:w-64 -translate-y-[3rem] xs:-translate-y-[4rem] sm:-translate-y-[6rem] rounded-full bg-[#B478FF] blur-2xl"
                ></motion.div>
                <motion.div
                    initial={{ width: "10rem" }}
                    whileInView={{ width: "20rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-auto z-50 h-0.5 w-[16rem] xs:w-[20rem] sm:w-[30rem] -translate-y-[3.5rem] xs:-translate-y-[4.5rem] sm:-translate-y-[7rem] bg-[#B478FF]"
                ></motion.div>
                <div className="absolute inset-auto z-40 h-16 xs:h-24 sm:h-44 w-full -translate-y-[5rem] xs:-translate-y-[7rem] sm:-translate-y-[12.5rem] bg-[#0B0B0B]"></div>
            </div>

            {/* Main content: logo + form, stacked below lamp */}
            <div
                className="relative z-50 flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl px-2 sm:px-0 rounded-xl shadow-lg"
                style={{
                    background: "#121212", // Charcoal Black
                    color: "#F0E6FF",      // Text
                    border: "1.5px solid #5C2E91" // Purple Outline
                }}
            >
                {children}
            </div>
        </div>
    );
};
