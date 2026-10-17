import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sheltersApi } from '../api/shelters';
import { coreApi } from '../api/core';
import { ShelterCard } from '../components/ui/ShelterCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { extractResults } from '../utils/apiHelpers';
import { Search, RotateCcw, AlertTriangle, PlusCircle, Building2 } from 'lucide-react';
import type { AnimalType, VerificationStatus, CebuLocation, Shelter } from '../types';

export function ShelterDirectoryPage() {
  const [search, setSearch] = useState(() => sessionStorage.getItem('surfur_shelter_search') || '');
  const [city, setCity] = useState<number | undefined>(() => {
    const v = sessionStorage.getItem('surfur_shelter_city');
    return v ? Number(v) : undefined;
  });
  const [animalTypes, setAnimalTypes] = useState<AnimalType | undefined>(() => {
    const v = sessionStorage.getItem('surfur_shelter_animals');
    return (v as AnimalType) || undefined;
  });
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | undefined>(() => {
    const v = sessionStorage.getItem('surfur_shelter_verification');
    return (v as VerificationStatus) || undefined;
  });

  // Sync state to sessionStorage
  useEffect(() => {
    if (search) sessionStorage.setItem('surfur_shelter_search', search);
    else sessionStorage.removeItem('surfur_shelter_search');
  }, [search]);

  useEffect(() => {
    if (city !== undefined) sessionStorage.setItem('surfur_shelter_city', String(city));
    else sessionStorage.removeItem('surfur_shelter_city');
  }, [city]);

  useEffect(() => {
    if (animalTypes) sessionStorage.setItem('surfur_shelter_animals', animalTypes);
    else sessionStorage.removeItem('surfur_shelter_animals');
  }, [animalTypes]);

  useEffect(() => {
    if (verificationStatus) sessionStorage.setItem('surfur_shelter_verification', verificationStatus);
    else sessionStorage.removeItem('surfur_shelter_verification');
  }, [verificationStatus]);

  // Restore and preserve scroll position
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('surfur_shelter_scroll');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: Number(savedScroll), behavior: 'instant' });
      }, 50);
    }

    const handleScroll = () => {
      sessionStorage.setItem('surfur_shelter_scroll', String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const {
    data: locationsData,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: () => coreApi.getLocations(),
  });

  const locations = extractResults<CebuLocation>(locationsData);

  const {
    data: sheltersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['shelters', { search, city, animalTypes, verificationStatus }],
    queryFn: () =>
      sheltersApi.list({
        search,
        city,
        animal_types: animalTypes,
        verification_status: verificationStatus,
      }),
  });

  const shelters = extractResults<Shelter>(sheltersData);

  return (
    <div className="w-full min-h-full bg-[#FFEBF1] dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header with Register a Shelter CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
            Animal Shelters & Rescue Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] mt-1">
            Explore registered welfare foundations, municipal pounds, and foster networks caring for animals across the Philippines.
          </p>
        </div>

        <Link to="/shelters/register" className="w-full sm:w-auto shrink-0">
          <Button
            size="md"
            className="w-full sm:w-auto font-bold bg-[#D4FFC6] hover:bg-[#bdf8ab] active:bg-[#aef49b] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:active:bg-[#a81f37] dark:text-white dark:border-transparent shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-[#FF81AB]"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Register a Shelter
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#2A1A2A] p-4 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 items-stretch sm:items-center text-xs shadow-xs">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="h-4 w-4 text-[#786875] dark:text-[#C9B8C7] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shelter name or mission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FFEBF1]/50 dark:bg-[#231423] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-[#352633] dark:text-[#FCE4EC] outline-none focus:ring-2 focus:ring-[#FF81AB]"
          />
        </div>

        <select
          value={city || ''}
          onChange={(e) => setCity(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full sm:w-auto p-2 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
        >
          <option value="">All Municipalities</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <select
          value={animalTypes || ''}
          onChange={(e) => setAnimalTypes((e.target.value as any) || undefined)}
          className="w-full sm:w-auto p-2 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
        >
          <option value="">All Animal Types</option>
          <option value="dogs">🐶 Dogs Only</option>
          <option value="cats">🐱 Cats Only</option>
          <option value="both">🐾 Dogs & Cats</option>
        </select>

        <select
          value={verificationStatus || ''}
          onChange={(e) => setVerificationStatus((e.target.value as any) || undefined)}
          className="w-full sm:w-auto p-2 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
        >
          <option value="">All Verification Statuses</option>
          <option value="verified">Verified Only</option>
          <option value="pending">Pending Review</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="bg-[#FFEBF1] dark:bg-[#382338] border border-[#F1D5DF] dark:border-[#4D2E4D] p-8 rounded-3xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-[#F4435A] mx-auto" />
          <p className="text-sm font-bold text-[#F4435A] dark:text-[#F48FB1]">
            Unable to load shelters directory. Please ensure the backend server is running.
          </p>
          <Button size="sm" onClick={() => refetch()} className="font-bold">
            <RotateCcw className="h-4 w-4 mr-1.5" /> Try Again
          </Button>
        </div>
      ) : shelters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((s) => (
            <ShelterCard key={s.id} shelter={s} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No shelters found"
          description="Try broadening your search or municipality filter."
        />
      )}
      </div>
    </div>
  );
}
