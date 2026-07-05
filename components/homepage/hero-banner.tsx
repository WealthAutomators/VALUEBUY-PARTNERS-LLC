"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroSlides } from "@/data/homepage";
import { company } from "@/data/company";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";

export function HeroBanner() {
  return (
    <section className="relative border-b border-border">
      <Carousel autoplay showDots showArrows className="w-full">
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative aspect-[16/6] min-h-[480px] w-full md:min-h-[560px] lg:aspect-[16/5]">
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={slide.id === "1"}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.25),transparent_55%)]" />
            <Container className="relative flex h-full items-center">
              <motion.div
                className="max-w-xl text-white"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {company.name}
                </span>
                <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                  {slide.headline}
                </h1>
                <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">{slide.description}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button asChild size="default" className="bg-white text-primary hover:bg-accent hover:text-white">
                    <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                  </Button>
                  {slide.secondaryCtaText && slide.secondaryCtaLink && (
                    <Button
                      asChild
                      size="default"
                      variant="outline"
                      className="border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white"
                    >
                      <Link href={slide.secondaryCtaLink}>{slide.secondaryCtaText}</Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            </Container>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
