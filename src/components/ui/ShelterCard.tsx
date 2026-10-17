import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, Mail, Building2 } from 'lucide-react';
import type { Shelter } from '../../types';
import { Badge } from './Badge';
import { DEFAULT_SHELTER_IMAGE } from '../../utils/constants';

interface ShelterCardProps {
  shelter: Shelter;
}

export function ShelterCard({ shelter }: ShelterCardProps) {
  const animalLabels: Record<string, string> = {
    dogs: '🐶 Dogs Only',
    cats: '🐱 Cats Only',
    both: '🐶🐱 Dogs & Cats',
    other: '🐾 Other Animals',
  };

  const coverUrl = shelter.cover_image || shelter.profile_image || DEFAULT_SHELTER_IMAGE;
  // Only show a separate thumbnail if profile_image is distinct from cover_image and not empty
  const hasDistinctLogo =
    Boolean(shelter.profile_image) &&
    shelter.profile_image !== shelter.cover_image &&
    shelter.profile_image !== DEFAULT_SHELTER_IMAGE;

  return (
    <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl shadow-xs border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Dedicated Cover Photo Container - Completely separate from info, no negative margins */}
        <div className="relative w-full h-48 sm:h-52 bg-[#FCE4EC]/40 dark:bg-[#1E121E] overflow-hidden border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
          <img
            src={coverUrl}
            alt={`${shelter.name} cover`}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges on top of cover without blocking lower image content */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {shelter.is_demo && <Badge variant="pink">DEMO</Badge>}
            {shelter.verification_status === 'verified' ? (
              <Badge variant="mint">
                <CheckCircle className="h-3 w-3 mr-1 inline text-[#224424]" /> Verified
              </Badge>
            ) : shelter.verification_status === 'pending' ? (
              <Badge variant="pink">Pending Review</Badge>
            ) : (
              <Badge variant="gray">Unverified</Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-[#2A1A2A]/95 text-[#352633] dark:text-[#FCE4EC] shadow-xs backdrop-blur-xs border border-[#F1D5DF]/60 dark:border-[#4D2E4D]">
              {animalLabels[shelter.animal_types] || 'Animals'}
            </span>
          </div>
        </div>

        {/* Shelter Info Section - Sits strictly below cover photo */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-start gap-3">
            {hasDistinctLogo ? (
              <img
                src={shelter.profile_image}
                alt={`${shelter.name} logo`}
                className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#2A1A2A] shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center shrink-0 border border-[#F1D5DF] dark:border-[#4D2E4D]">
                <Building2 className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-[#352633] dark:text-[#FCE4EC] leading-snug break-words line-clamp-2">
                {shelter.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#786875] dark:text-[#C9B8C7]">
                <MapPin className="h-3.5 w-3.5 text-[#F4435A] dark:text-[#F48FB1] shrink-0" />
                <span className="truncate">{shelter.city_detail?.name || 'Cebu'}, Cebu</span>
              </div>
            </div>
          </div>

          {shelter.description && (
            <p className="text-xs text-[#786875] dark:text-[#C9B8C7] line-clamp-2 leading-relaxed">
              {shelter.description.replace(/^\[DEMO DATA - Not a real shelter\]\s*/i, '')}
            </p>
          )}

          <div className="space-y-1.5 pt-1 text-xs text-[#786875] dark:text-[#C9B8C7]">
            {shelter.phone_number && (
              <div className="flex items-center gap-2 truncate">
                <Phone className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                <span className="truncate">{shelter.phone_number}</span>
              </div>
            )}
            {shelter.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-[#E94EAA] shrink-0" />
                <span className="truncate">{shelter.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between text-xs py-2.5 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
          <span className="text-xs font-semibold text-[#786875] dark:text-[#C9B8C7]">
            Adoptable Companions
          </span>
          <span className="font-black text-xs text-[#F4435A] dark:text-[#F48FB1]">
            {shelter.available_pets_count} available
          </span>
        </div>

        <Link to={`/shelters/${shelter.slug}`} state={{ fromDirectory: true }} className="block">
          <button className="w-full py-2.5 px-4 bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:active:bg-[#a81f37] dark:text-white dark:border-transparent rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF81AB]">
            View Shelter
          </button>
        </Link>
      </div>
    </div>
  );
}
