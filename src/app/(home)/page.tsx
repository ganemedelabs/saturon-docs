"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

function Background() {
    const fogs = [
        { color: "#f472b6", position: "top-0 left-1/4", delay: "0s" },
        { color: "#3b82f6", position: "bottom-0 right-1/3", delay: "3s" },
        { color: "#a855f7", position: "top-1/2 right-0", delay: "6s" },
    ];

    return (
        <>
            <style>{`
                @keyframes floatGlow {
                    0%, 100% {
                        transform: translateY(0px) scale(1);
                        opacity: 0.25;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.05);
                        opacity: 0.5;
                    }
                }

                .animate-floatGlow {
                    animation: floatGlow 12s ease-in-out infinite;
                    will-change: transform, opacity;
                }
            `}</style>

            <div className="absolute inset-0 overflow-visible" aria-hidden="true">
                {fogs.map((fog, i) => (
                    <div
                        key={i}
                        className={`absolute h-[1000px] w-[1000px] ${fog.position} animate-floatGlow rounded-full opacity-30`}
                        style={{
                            background: `radial-gradient(circle, ${fog.color} 0%, transparent 70%)`,
                            filter: "blur(80px)",
                            animationDelay: fog.delay,
                        }}
                    />
                ))}
            </div>
        </>
    );
}

function Title() {
    return (
        <>
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animated-gradient {
                    background: linear-gradient(-45deg, #f472b6, #3b82f6, #a855f7, #22d3ee);
                    background-size: 200% 200%;
                    animation: gradientShift 12s ease infinite;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    will-change: background-position;
                }

                @media (max-width: 768px) {
                    .animated-gradient {
                        animation: none;
                        background-size: 100% 100%;
                        opacity: 0.15;
                    }
                }
            `}</style>

            <h1
                className="animated-gradient absolute top-0 right-0 text-[10rem] uppercase opacity-10 select-none md:text-[15rem]"
                aria-hidden="true"
            >
                Saturon
            </h1>
        </>
    );
}

function Header() {
    return (
        <header className="relative" role="banner">
            <Background />

            <div className="max-w-fd-container relative left-1/2 flex h-[calc(100vh-3.5rem)] -translate-x-1/2 items-end p-8">
                <div className="w-full">
                    <Title />

                    <h2 className="mt-0 mb-4 text-4xl leading-tight font-bold text-balance md:text-6xl">
                        The CSS color
                        <br />
                        engine for the
                        <br /> web&apos;s future.
                    </h2>

                    <p className="mb-4 leading-8 font-medium text-pretty md:text-xl">
                        It&apos;s simple enough for developers,
                        <br />
                        expressive enough for designers,
                        <br />
                        and extensible enough for researchers.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/docs"
                            role="button"
                            aria-label="Get started with Saturon documentation"
                            className="bg-fd-primary text-fd-primary-foreground focus:ring-fd-primary/50 inline-block rounded-full px-6 py-3 font-semibold no-underline transition-all duration-200 ease-in-out focus:ring-4 focus:outline-none md:text-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

function FeatureCard({ img, title, description }: { img: string; title: string; description: string }) {
    const rawAlt = img.split("/").pop()?.split(".")[0] ?? "Feature";
    const altText = rawAlt.replace(/[-_]/g, " ");

    return (
        <article
            className="w-full p-6 text-center sm:w-1/2 lg:w-1/3"
            role="region"
            aria-labelledby={`${altText}-title`}
        >
            <div className="mb-10 flex justify-center">
                <div className="relative h-32 w-32 p-2">
                    <Image
                        src={img}
                        alt={`${title} illustration`}
                        fill
                        sizes="96px"
                        loading="lazy"
                        className="object-contain"
                    />
                </div>
            </div>

            <h3 id={`${altText}-title`} className="mb-4 text-lg font-semibold sm:text-xl">
                {title}
            </h3>
            <p className="text-sm leading-relaxed sm:text-base">{description}</p>
        </article>
    );
}

function Features() {
    const features = [
        {
            img: "/images/undraw_complete-design.svg",
            title: "Full CSS <color> Grammar",
            description: "Supports CSS Color Levels 4 & 5 syntax.",
        },
        {
            img: "/images/undraw_choose-color.svg",
            title: "Native color-mix() Support",
            description: "Includes relative color syntax and blending.",
        },
        {
            img: "/images/undraw_stars.svg",
            title: "Modern Color Spaces",
            description: "OKLCh, Oklab, Display-P3, Rec.2020 and more.",
        },
        {
            img: "/images/undraw_convert.svg",
            title: "Advanced Gamut Mapping",
            description: "Choose clip, chroma reduction, or CSS official.",
        },
        {
            img: "/images/undraw_add-post.svg",
            title: "Plugin Architecture",
            description: "Extend with custom spaces, functions, and syntax.",
        },
        {
            img: "/images/undraw_pedestrian-crossing.svg",
            title: "Accessibility Tools",
            description: "Built-in contrast and ΔE color difference metrics.",
        },
    ];

    return (
        <section className="py-20" aria-labelledby="features-heading" role="region">
            <div className="mx-auto max-w-7xl px-4">
                <h2 id="features-heading" className="sr-only">
                    Key Features of Saturon
                </h2>

                <div className="box-border flex flex-wrap" role="list">
                    {features.map((props, idx) => (
                        <FeatureCard key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home(): ReactNode {
    return (
        <main className="prose" id="main-content">
            <a
                href="#main-content"
                className="sr-only z-50 rounded-md bg-white px-4 py-2 text-black focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
            >
                Skip to main content
            </a>
            <Header />
            <Features />
        </main>
    );
}
