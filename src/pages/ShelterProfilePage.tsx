import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sheltersApi } from '../api/shelters';
import { petsApi } from '../api/pets';
import { PetCard } from '../components/ui/PetCard';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { DEFAULT_SHELTER_IMAGE } from '../utils/constants';
import { MapPin, Phone, Mail, Globe, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export function ShelterProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: shelter, isLoading: shelterLoading } = useQuery({
    queryKey: ['shelter', slug],
    queryFn: () => sheltersApi.detail(slug!),
    enabled: !!slug,
  });

  const { data: shelterPetsData, isLoading: petsLoading } = useQuery({
    queryKey: ['shelterPets', slug],
    queryFn: () => petsApi.getShelterPets(slug!),
    enabled: !!slug,
  });

  const handleBackToShelters = () => {
    if (location.state?.fromDirectory || (window.history.length > 1 && document.referrer.includes('/shelters'))) {
      navigate(-1);
    } else {
      navigate('/shelters');
    }
  };

  if (shelterLoading) return <Spinner size="lg" />;
  if (!shelter) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <p className="text-[#786875] dark:text-[#C9B8C7]">Shelter profile not found.</p>
        <div>
          <button
            onClick={handleBackToShelters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] transition-colors cursor-pointer"
            aria-label="Back to Shelters"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shelters</span>
          </button>
        </div>
      </div>
    );
  }

  const pets = (shelterPetsData as any)?.results || (Array.isArray(shelterPetsData) ? shelterPetsData : []);

  return (
    <div className="w-full min-h-full bg-[#FFEBF1] dark:bg-transparent pb-16">
      {/* Top Navigation: Back to Shelters Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={handleBackToShelters}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] transition-colors cursor-pointer"
          aria-label="Back to Shelters"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shelters</span>
        </button>
      </div>

      {/* Cover Header */}
      <div className="relative w-full aspect-21/9 sm:aspect-16/6 min-h-[260px] max-h-[460px] bg-[#FFEBF1] dark:bg-[#1E121E] overflow-hidden border-y border-[#F1D5DF] dark:border-[#4D2E4D]">
        <img
          src={shelter.cover_image || DEFAULT_SHELTER_IMAGE}
          alt={shelter.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 flex items-end pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 text-white">
            <img
              src={shelter.profile_image || DEFAULT_SHELTER_IMAGE}
              alt={shelter.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-[#2A1A2A] shadow-xl bg-white dark:bg-[#2A1A2A]"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black">{shelter.name}</h1>
                {shelter.verification_status === 'verified' && (
                  <Badge variant="mint" className="text-xs">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 inline" /> Verified Shelter
                  </Badge>
                )}
                {shelter.is_demo && <Badge variant="pink">DEMO</Badge>}
              </div>
              <p className="text-xs text-[#FCE4EC] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1]" /> {shelter.city_detail?.name}, Cebu Province
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: About & Adoptable Animals */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-[#352633] dark:text-[#FCE4EC]">About Organization</h2>
            <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed whitespace-pre-line">
              {shelter.description}
            </p>

            {shelter.mission && (
              <div className="pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                <h4 className="text-xs font-bold uppercase text-[#FF81AB] dark:text-[#F48FB1] mb-1">Our Mission</h4>
                <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed italic">{shelter.mission}</p>
              </div>
            )}

            {shelter.adoption_requirements && (
              <div className="pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                <h4 className="text-xs font-bold uppercase text-[#FF81AB] dark:text-[#F48FB1] mb-1">Adoption Guidelines & Screening</h4>
                <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed">{shelter.adoption_requirements}</p>
              </div>
            )}
          </div>

          {/* Shelter Pets */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">
                Companions at {shelter.name} ({pets.length})
              </h2>
            </div>

            {petsLoading ? (
              <Spinner />
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((p: any) => (
                  <PetCard key={p.id} pet={p} />
                ))}
              </div>
            ) : (
              <EmptyState title="No animals currently listed under this shelter" />
            )}
          </div>
        </div>

        {/* Right: Contact & Visiting Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-4 text-xs shadow-xs">
            <h3 className="text-sm font-bold text-[#352633] dark:text-[#FCE4EC] uppercase tracking-wider">
              Contact & Location
            </h3>

            <div className="space-y-2.5 text-[#786875] dark:text-[#C9B8C7]">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#FF81AB] dark:text-[#F48FB1] shrink-0 mt-0.5" />
                <span>{shelter.address || 'Address provided upon scheduled visit'}</span>
              </div>
              {shelter.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                  <span>{shelter.phone_number}</span>
                </div>
              )}
              {shelter.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                  <span>{shelter.email}</span>
                </div>
              )}
            </div>

            {shelter.operating_hours && Object.keys(shelter.operating_hours).length > 0 && (
              <div className="pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] space-y-1.5">
                <span className="font-bold text-[#352633] dark:text-[#FCE4EC] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1]" /> Visiting Hours
                </span>
                {Object.entries(shelter.operating_hours).map(([day, hrs]) => (
                  <div key={day} className="flex justify-between text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                    <span className="capitalize">{day.replace('_', ' ')}</span>
                    <span className="font-semibold text-[#352633] dark:text-[#FCE4EC]">{hrs}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] flex gap-2">
              {shelter.website && (
                <a
                  href={shelter.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:text-[#FF81AB] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {shelter.facebook_url && (
                <a
                  href={shelter.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:text-[#FF81AB] hover:bg-[#FFEBF1] dark:hover:bg-[#382338] transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
