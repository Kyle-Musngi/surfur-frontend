import { Heart, ShieldCheck, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/images/sulfor-logo.jpeg"
            alt="SurFur Logo"
            className="h-12 w-auto object-contain rounded-lg shadow-xs"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
            }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4435A] dark:text-[#F48FB1]">About SurFur</span>
        </div>
        <h1 className="text-4xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Surf for Paws, Find Your Furever Home
        </h1>
        <p className="text-sm text-[#786875] dark:text-[#C9B8C7] max-w-xl mx-auto leading-relaxed">
          Connecting adoptable rescued street companions with compassionate adopters across Cebu and the Philippines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#352633] dark:text-[#FCE4EC]">Aspin & Puspin Advocacy</h3>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
            Highlighting native Philippine street dogs and cats as resilient, loyal, and loving family companions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#352633] dark:text-[#FCE4EC]">Shelter Verification</h3>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
            Verifying organizations to prevent fraudulent adoptions, commercial breeders, or animal exploitation.
          </p>
        </div>

        <div className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#352633] dark:text-[#FCE4EC]">Community Rescue Support</h3>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
            Targeted coordination with local animal welfare groups, pounds, and independent community rescuers.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-4 text-xs sm:text-sm text-[#352633] dark:text-[#FCE4EC] leading-relaxed">
        <h2 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">Our Ethical Charter</h2>
        <p className="text-[#786875] dark:text-[#C9B8C7]">
          SurFur was founded to bridge the technology gap for animal welfare in the Philippines. While hundreds of compassionate rescues happen every month, independent shelters and community feeders struggle with manual coordination across disparate social media groups.
        </p>
        <p className="text-[#786875] dark:text-[#C9B8C7]">
          By consolidating adoptable listings, verified shelter locations, lost/stray reporting, and educational resources into a secure platform, we empower both adopters and welfare organizations.
        </p>
        <p className="text-[11px] text-[#786875] dark:text-[#C9B8C7] pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
          *Note: SurFur is an independent animal welfare platform. All trademarks, names, and organizations mentioned adhere to Philippine digital compliance and data privacy regulations (RA 10173).
        </p>
      </div>
    </div>
  );
}
