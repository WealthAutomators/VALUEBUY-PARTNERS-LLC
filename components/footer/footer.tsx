import Link from "next/link";
import Image from "next/image";
import { Globe, Share2, Users } from "lucide-react";
import { company } from "@/data/company";
import { footerLinks, paymentMethods } from "@/data/navigation";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/logo/logo.svg" alt={company.name} width={180} height={48} className="mb-4" />
            <p className="text-sm leading-relaxed text-muted-foreground">{company.description}</p>
            <div className="mt-4 flex gap-3">
              <a href={company.social.instagram} className="text-muted-foreground transition-colors hover:text-primary" aria-label="Instagram">
                <Share2 className="h-5 w-5" />
              </a>
              <a href={company.social.facebook} className="text-muted-foreground transition-colors hover:text-primary" aria-label="Facebook">
                <Users className="h-5 w-5" />
              </a>
              <a href={company.social.twitter} className="text-muted-foreground transition-colors hover:text-primary" aria-label="Twitter">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2.5">
              {footerLinks.customerCare.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                {company.address.street}<br />
                {company.address.city}, {company.address.state} {company.address.zip}
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-primary">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Separator />

      <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">{company.copyright}</p>
        <div className="flex items-center gap-2">
          {paymentMethods.map((method) => (
            <Image key={method.name} src={method.icon} alt={method.name} width={40} height={28} />
          ))}
        </div>
      </Container>
    </footer>
  );
}
