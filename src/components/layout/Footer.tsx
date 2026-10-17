import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Heart, ChevronDown } from 'lucide-react';

export function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className="bg-[#E9FFE4] text-gray-800 mt-auto border-t border-[#CFEBC8] dark:bg-[#1E121E] dark:text-[#C9B8C7] dark:border-[#382338] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <img
                src="/images/sulfor-logo.jpeg"
                alt="SurFur Logo"
                className="h-10 w-auto max-w-[44px] object-contain rounded-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
                }}
              />
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Sur</span>
                  <span className="text-xl font-black text-[#E94EAA] tracking-tight">Fur</span>
                </div>
                <span className="text-[10px] text-[#D81B60] dark:text-[#F48FB1] font-bold">Philippines Animal Rescue</span>
              </div>
            </div>
            <p className="text-xs text-gray-800 dark:text-[#C9B8C7] leading-relaxed max-w-sm">
              Surf for Paws, Find Your Furever Home<br />
              Connecting animal lovers with legitimate shelters, rescue organizations, and community rescuers across Cebu and the Philippines.
            </p>
            <div className="flex gap-2 pt-1 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-xl bg-white hover:bg-[#FFEBF1] text-gray-900 border border-[#CFEBC8] dark:bg-[#2A1A2A] dark:hover:bg-[#F4435A] dark:text-[#FCE4EC] dark:hover:text-white dark:border-transparent transition-colors shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-white hover:bg-[#FFEBF1] text-gray-900 border border-[#CFEBC8] dark:bg-[#2A1A2A] dark:hover:bg-[#F4435A] dark:text-[#FCE4EC] dark:hover:text-white dark:border-transparent transition-colors shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="border-b border-[#CFEBC8] dark:border-[#382338] md:border-none pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('companion')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left select-none focus:outline-none"
              aria-expanded={!!openSections['companion']}
            >
              <h4 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider md:mb-4">
                Find a Companion
              </h4>
              <ChevronDown
                className={`h-4 w-4 text-[#D81B60] dark:text-[#F48FB1] md:hidden transition-transform duration-200 ${
                  openSections['companion'] ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2 text-xs pt-2 pb-2 md:pt-0 md:pb-0 ${openSections['companion'] ? 'block' : 'hidden md:block'}`}>
              {[
                { to: '/pets?species=dog', label: '🐶 Adopt an Aspin / Dog' },
                { to: '/pets?species=cat', label: '🐱 Adopt a Puspin / Cat' },
                { to: '/quiz', label: '🎯 Pet Matching Quiz' },
                { to: '/map', label: '🗺️ Shelter Map' },
                { to: '/shelters', label: '🏢 Verified Shelter Directory' },
                { to: '/events', label: '🎉 Adoption Drives & Events' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-800 hover:text-[#D81B60] font-medium dark:text-[#C9B8C7] dark:hover:text-[#F48FB1] dark:font-normal transition-colors block py-1 md:py-0">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Rescue */}
          <div className="border-b border-[#CFEBC8] dark:border-[#382338] md:border-none pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('community')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left select-none focus:outline-none"
              aria-expanded={!!openSections['community']}
            >
              <h4 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider md:mb-4">
                Community & Rescue
              </h4>
              <ChevronDown
                className={`h-4 w-4 text-[#D81B60] dark:text-[#F48FB1] md:hidden transition-transform duration-200 ${
                  openSections['community'] ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2 text-xs pt-2 pb-2 md:pt-0 md:pb-0 ${openSections['community'] ? 'block' : 'hidden md:block'}`}>
              {[
                { to: '/report', label: '🚨 Report a Stray / Animal in Need' },
                { to: '/guide', label: '📖 Responsible Adoption Guide' },
                { to: '/donate', label: '💖 Donate & Sponsor Animals' },
                { to: '/shelters/register', label: '📝 Register an Organization' },
                { to: '/about', label: '🐾 About SurFur' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-800 hover:text-[#D81B60] font-medium dark:text-[#C9B8C7] dark:hover:text-[#F48FB1] dark:font-normal transition-colors block py-1 md:py-0">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="border-b border-[#CFEBC8] dark:border-[#382338] md:border-none pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left select-none focus:outline-none"
              aria-expanded={!!openSections['contact']}
            >
              <h4 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider md:mb-4">
                Contact & Privacy
              </h4>
              <ChevronDown
                className={`h-4 w-4 text-[#D81B60] dark:text-[#F48FB1] md:hidden transition-transform duration-200 ${
                  openSections['contact'] ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2.5 text-xs text-gray-800 dark:text-[#C9B8C7] pt-2 pb-2 md:pt-0 md:pb-0 ${openSections['contact'] ? 'block' : 'hidden md:block'}`}>
              <li className="flex items-center gap-2 py-1 md:py-0">
                <Mail className="h-4 w-4 text-[#D81B60] dark:text-[#F48FB1] shrink-0" />
                <span className="font-medium">support@surfur.ph</span>
              </li>
              <li className="flex items-center gap-2 py-1 md:py-0">
                <Phone className="h-4 w-4 text-[#D81B60] dark:text-[#F48FB1] shrink-0" />
                <span className="font-medium">SurFur Animal Welfare Support Desk</span>
              </li>
              <li className="text-[11px] text-gray-700 dark:text-[#8e7a8c] pt-2 border-t border-[#CFEBC8] dark:border-[#382338] leading-normal">
                Complies with the Philippine Data Privacy Act of 2012 (RA 10173). Private rescuer locations and reporter contact details are strictly protected.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#CFEBC8] dark:border-[#382338] mt-8 md:mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-800 dark:text-[#8e7a8c] gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SurFur. Built for animal welfare and rescue in the Philippines.</p>
          <p className="flex items-center justify-center gap-1 text-[11px]">
            Final adoption decisions rest strictly with registered shelters. Made with <Heart className="h-3 w-3 text-[#F4435A] fill-[#F4435A] inline" /> for rescue animals.
          </p>
        </div>
      </div>
    </footer>
  );
}
