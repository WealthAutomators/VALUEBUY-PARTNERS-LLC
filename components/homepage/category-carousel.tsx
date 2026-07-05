"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const homepageCategorySlugs = [
  "electronics",
  "home-kitchen",
  "bathroom",
  "educational-toys",
  "pet-supplies",
  "beauty",
  "sports-outdoors",
  "office-supplies",
  "fashion-accessories",
  "baby-products",
];

const gradientOverlays = [
  "from-violet-600/80 to-purple-900/60",
  "from-amber-500/80 to-orange-600/60",
  "from-pink-500/80 to-rose-600/60",
  "from-blue-500/80 to-indigo-600/60",
  "from-emerald-500/80 to-teal-600/60",
  "from-fuchsia-500/80 to-purple-600/60",
  "from-cyan-500/80 to-blue-600/60",
  "from-orange-500/80 to-red-500/60",
  "from-rose-500/80 to-pink-600/60",
  "from-lime-500/80 to-green-600/60",
];

export function CategoryCarousel() {
  const homepageCategories = categories.filter((c) => homepageCategorySlugs.includes(c.slug));

  return (
    <section className="py-8 md:py-10">
      <Container>
        <SectionHeading title="Shop by Category" centered />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {homepageCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${gradientOverlays[index % gradientOverlays.length]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-sm font-semibold text-white drop-shadow-md transition-transform duration-300 group-hover:translate-y-0 md:text-base">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
