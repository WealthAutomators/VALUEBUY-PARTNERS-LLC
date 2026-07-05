"use client";

import { Navbar } from "@/components/navbar/navbar";
import { SearchBar } from "@/components/navbar/search-bar";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="h-1 bg-gradient-to-r from-primary via-primary to-accent" />
      <Navbar />
      <SearchBar />
    </div>
  );
}
