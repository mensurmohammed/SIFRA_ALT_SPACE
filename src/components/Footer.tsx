import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Camera, Smartphone, X } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer style={{ background: "#352214" }}>
      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 md:px-8 py-[60px]">
        {/* Col 1 – Brand */}
        <div>
          <div className="mb-3">
            <Logo className="h-10 w-auto text-accent-gold" />
          </div>
          <p className="text-white/80 text-[13px] leading-relaxed mb-5">
            A quiet book café and alternative space where coffee, culture, and
            community come together.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[Camera, Smartphone, X].map((Icon, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-[6px] bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white cursor-pointer transition-colors"
              >
                <Icon className="w-4 h-4" />
              </span>
            ))}
          </div>
        </div>

        {/* Col 2 – Explore */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: "Home", href: "/" },
              { label: "Books", href: "/books" },
              { label: "Events", href: "/events" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/75 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 – Hours & Location */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-4">
            Hours &amp; Location
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-white/75 text-sm">
              <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>Addis Ababa, Ethiopia</span>
            </li>
            <li className="flex items-start gap-2 text-white/75 text-sm">
              <Clock className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>Mon–Fri: 7am – 9pm</span>
            </li>
            <li className="flex items-start gap-2 text-white/75 text-sm">
              <Clock className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>Sat–Sun: 9am – 10pm</span>
            </li>
          </ul>
        </div>

        {/* Col 4 – Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-4">
            Contact
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-white/75 text-sm">
              <Phone className="w-4 h-4 text-accent-gold shrink-0" />
              <span>+251 911 000 000</span>
            </li>
            <li className="flex items-center gap-2 text-white/75 text-sm">
              <Mail className="w-4 h-4 text-accent-gold shrink-0" />
              <span>hello@sifra.et</span>
            </li>
            <li className="pt-2">
              <Link href="/privacy" className="text-white/50 text-xs hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/50 text-xs hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-4 md:px-8 py-4">
        <p className="text-center text-[11px] text-white/50">
          &copy; {new Date().getFullYear()} Sifra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
