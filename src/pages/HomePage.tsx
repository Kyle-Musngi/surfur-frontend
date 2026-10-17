import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import { Button } from '../components/ui/Button';
import { useI18n } from '../contexts/I18nContext';
import { extractResults } from '../utils/apiHelpers';
import type { Event } from '../types';
import { Search, MapPin, Shield, AlertTriangle, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export function HomePage() {
  const { t } = useI18n();

  const { data: eventsData } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => eventsApi.list(),
  });

  const events = extractResults<Event>(eventsData);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#E9FFE4] dark:bg-[#1E121E] dark:bg-gradient-to-b dark:from-[#2A1A2A] dark:via-[#382338] dark:to-[#1E121E] text-gray-900 dark:text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
        <div className="hidden dark:block absolute inset-0 opacity-15 bg-[radial-gradient(#FF81AB_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEBF1] dark:bg-[#FCE4EC]/15 border border-[#FF81AB]/40 text-gray-900 dark:text-[#FCE4EC] text-xs font-bold backdrop-blur-xs">
              <img
                src="/images/sulfor-logo.jpeg"
                alt="SurFur"
                className="w-5 h-5 rounded-md object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
                }}
              />
              <span>SurFur — Animal Rescue & Adoption Platform</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
              {t.hero.headline}
            </h1>
            <p className="text-sm sm:text-lg text-gray-800 dark:text-[#FCE4EC]/90 max-w-2xl font-medium leading-relaxed">
              {t.hero.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
              <Link to="/pets" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent shadow-md font-bold">
                  <Search className="h-5 w-5 mr-1" /> {t.hero.findCompanion}
                </Button>
              </Link>
              <Link to="/map" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-[#352633] border-gray-400 hover:bg-[#FFEBF1] dark:text-white dark:border-white/40 dark:hover:bg-white/15 font-bold">
                  <MapPin className="h-5 w-5 mr-1" /> {t.hero.exploreMap}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/20 bg-white dark:bg-[#2A1A2A]">
              <img
                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&h=650&fit=crop&q=80"
                alt="Happy rescued cat and dog companions in the Philippines"
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5 sm:p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF81AB] dark:text-[#F48FB1]">
                    Philippines Community Rescues
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-[#FCE4EC]">
                    Rescued Aspins & Puspins awaiting responsible adopters across verified rescue centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER HOMEPAGE: FULL-WIDTH PALE PINK (#FFEBF1) IN LIGHT MODE */}
      <div className="w-full bg-[#FFEBF1] dark:bg-transparent pt-10 pb-16 sm:pt-16 sm:pb-20 space-y-12 sm:space-y-16">
        {/* 2. HOW ADOPTION WORKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white dark:bg-[#1E121E] text-[#FF81AB] dark:text-[#F48FB1] border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-2xs mb-2">
              Transparent & Loving Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-[#FCE4EC] mt-1">
              How Animal Adoption Works in the Philippines
            </h2>
            <p className="text-xs sm:text-base font-semibold text-gray-800 dark:text-[#C9B8C7] mt-2">
              Every step is designed to safeguard both pet and adopter through authorized rescue shelters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4 relative">
            {[
              { step: '1', title: t.adoption.step1, desc: 'Search rescued dogs & cats by breed, age, size, and municipality.' },
              { step: '2', title: t.adoption.step2, desc: 'Review temperament, health notes, vaccine status, and rescue backstory.' },
              { step: '3', title: t.adoption.step3, desc: 'Submit a free verified inquiry form directly to the holding shelter.' },
              { step: '4', title: t.adoption.step4, desc: 'Participate in the shelter’s standard interview or home-check.' },
              { step: '5', title: t.adoption.step5, desc: 'Sign the adoption covenant and give them a forever home!' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1E121E] rounded-3xl p-5 border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#D4FFC6] text-gray-900 border border-[#bce8ad] dark:bg-[#253826] dark:text-[#DDF5D5] dark:border-transparent font-black text-sm mb-3">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-[#FCE4EC] mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-800 dark:text-[#C9B8C7] leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SHELTER MAP PREVIEW BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gradient-to-r dark:from-[#2A1A2A] dark:via-[#382338] dark:to-[#2A1A2A] rounded-3xl p-6 sm:p-10 lg:p-12 text-gray-900 dark:text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl border border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="space-y-4 max-w-xl z-10 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#FF81AB] dark:text-[#DDF5D5]">
                <MapPin className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1]" /> Interactive Locator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-gray-900 dark:text-white">
                Locate Verified Rescue Shelters Across Cebu & Philippines
              </h2>
              <p className="text-xs sm:text-sm text-gray-800 dark:text-[#FCE4EC] leading-relaxed font-medium">
                Explore shelters and pounds from Metro Cebu to provincial municipalities with verified contact channels and visiting hours.
              </p>
              <div className="pt-2">
                <Link to="/map" className="inline-block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-[#D4FFC6] hover:bg-[#bdf8ab] text-gray-900 border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent font-bold shadow-md">
                    Open Interactive Map
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative z-10 w-full sm:w-auto shrink-0">
              <div className="bg-white/95 dark:bg-[#1E121E]/60 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#F1D5DF]/20 text-center space-y-2 shadow-sm max-w-xs mx-auto">
                <span className="text-3xl font-black text-gray-900 dark:text-white">20+</span>
                <p className="text-xs text-[#FF81AB] dark:text-[#F48FB1] font-bold">Cities & Towns Covered</p>
                <div className="pt-2 border-t border-[#F1D5DF] dark:border-white/10 flex justify-center gap-1 text-xs flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBF1] text-gray-900 dark:bg-[#382338] dark:text-[#FCE4EC] text-[10px] font-bold">Cebu City</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBF1] text-gray-900 dark:bg-[#382338] dark:text-[#FCE4EC] text-[10px] font-bold">Mandaue</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBF1] text-gray-900 dark:bg-[#382338] dark:text-[#FCE4EC] text-[10px] font-bold">Lapu-Lapu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REPORT A STRAY CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl p-6 sm:p-8 border border-[#F1D5DF] dark:border-[#4D2E4D] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-3 bg-[#F4435A] text-white rounded-2xl shrink-0 mt-1 shadow-xs">
                <AlertTriangle className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#FCE4EC]">Found an Injured or Stray Animal?</h3>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-[#C9B8C7] mt-1 max-w-2xl leading-relaxed">
                  Report sighted street animals in need of medical intervention or rescue. Reports are reviewed and routed to verified community rescue groups.
                </p>
              </div>
            </div>
            <Link to="/report" className="shrink-0 w-full sm:w-auto">
              <Button variant="danger" size="md" className="w-full sm:w-auto font-bold">
                Submit Stray Report
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. UPCOMING ADOPTION EVENTS */}
        {events.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF81AB] dark:text-[#F48FB1]">Community</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-[#FCE4EC] mt-1">Upcoming Adoption Drives</h2>
              </div>
              <Link to="/events" className="text-xs font-bold text-[#FF81AB] dark:text-[#F48FB1] hover:underline inline-flex items-center gap-1">
                View all events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="bg-white dark:bg-[#2A1A2A] rounded-3xl p-5 sm:p-6 border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                  <img
                    src={ev.cover_photo || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&q=80'}
                    alt={ev.title}
                    className="w-full sm:w-36 h-40 sm:h-36 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#FF81AB] dark:text-[#F48FB1] font-bold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(ev.start_datetime).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-[#FCE4EC] leading-snug">{ev.title}</h4>
                    <p className="text-xs text-gray-800 dark:text-[#C9B8C7] line-clamp-2">{ev.description}</p>
                    <p className="text-xs text-gray-800 dark:text-[#C9B8C7] font-semibold">📍 {ev.venue_name || 'Cebu City'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PET MATCHING QUIZ PROMO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#F4435A] via-[#E94EAA] to-[#F48FB1] dark:bg-none dark:bg-[#2A1A2A] rounded-3xl p-6 sm:p-10 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl dark:shadow-none border border-transparent dark:border-[#4D2E4D]">
            <div className="space-y-3 max-w-xl text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-white/95 dark:text-[#FF81AB] flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#FF81AB]" /> Interactive Match Quiz
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-[#FCE4EC]">
                Not Sure Which Companion Fits Your Lifestyle?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 dark:text-[#C9B8C7] leading-relaxed">
                Take our 2-minute lifestyle quiz. We’ll match your living space, family setup, and activity level with compatible rescued dogs and cats in the Philippines.
              </p>
            </div>
            <Link to="/quiz" className="shrink-0 w-full sm:w-auto inline-block text-center">
              <Button
                variant="danger"
                size="md"
                className="btn-match-quiz w-full sm:w-auto bg-white hover:bg-pink-50 hover:scale-105 active:scale-95 text-gray-900 rounded-xl px-4 py-2 text-sm font-bold shadow-sm hover:shadow-md border border-transparent cursor-pointer transition-all duration-200 ease-in-out dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent dark:shadow-sm"
              >
                Start Match Quiz
              </Button>
            </Link>
          </div>
        </section>

        {/* 7. SHELTER REGISTRATION CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white dark:bg-[#2A1A2A] rounded-3xl p-6 sm:p-10 border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs">
          <Shield className="h-8 sm:h-10 w-8 sm:w-10 text-[#FF81AB] dark:text-[#F48FB1] mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-[#FCE4EC]">Are You Running a Shelter or Rescue in the Philippines?</h3>
          <p className="text-xs sm:text-sm text-gray-800 dark:text-[#C9B8C7] max-w-xl mx-auto mt-2 leading-relaxed">
            List your adoptable animals, manage applicant screening inquiries, and receive community support on SurFur free of charge.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/shelters/register" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto font-bold">
                Register Your Organization
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Learn Platform Guidelines
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
