import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { petsApi } from '../api/pets';
import { coreApi } from '../api/core';
import { PetCard } from '../components/ui/PetCard';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useI18n } from '../contexts/I18nContext';
import { extractResults } from '../utils/apiHelpers';
import { Search, Filter, X, SlidersHorizontal, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Species, Sex, Size, AgeCategory, CebuLocation, Pet } from '../types';

export function FindPetPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read filter values from URL or defaults
  const species = (searchParams.get('species') as Species) || undefined;
  const sex = (searchParams.get('sex') as Sex) || undefined;
  const size = (searchParams.get('size') as Size) || undefined;
  const age_category = (searchParams.get('age_category') as AgeCategory) || undefined;
  const city = searchParams.get('city') ? Number(searchParams.get('city')) : undefined;
  const is_vaccinated = searchParams.get('is_vaccinated') === 'true' ? true : undefined;
  const is_sterilized = searchParams.get('is_sterilized') === 'true' ? true : undefined;
  const verified_shelter_only = searchParams.get('verified_shelter_only') === 'true' ? true : undefined;
  const search = searchParams.get('search') || '';
  const ordering = searchParams.get('ordering') || '-created_at';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // Locations query with safe response normalization
  const {
    data: locationsData,
    isLoading: locationsLoading,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: () => coreApi.getLocations(),
  });

  const locations = extractResults<CebuLocation>(locationsData);

  // Pets query with safe response normalization
  const {
    data: petsData,
    isLoading: petsLoading,
    isError: petsError,
    refetch: refetchPets,
  } = useQuery({
    queryKey: [
      'pets',
      { species, sex, size, age_category, city, is_vaccinated, is_sterilized, verified_shelter_only, search, ordering, page },
    ],
    queryFn: () =>
      petsApi.list({
        species,
        sex,
        size,
        age_category,
        city,
        is_vaccinated,
        is_sterilized,
        verified_shelter_only,
        search,
        ordering,
        page,
        adoption_status: 'available',
      }),
  });

  const updateFilter = (key: string, value: string | boolean | undefined) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === false) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    nextParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = Array.from(searchParams.entries()).filter(
    ([k]) => !['page', 'ordering'].includes(k)
  ).length;

  const pets = extractResults<Pet>(petsData);
  const totalCount = (petsData && typeof petsData === 'object' && 'count' in petsData)
    ? (petsData.count as number)
    : pets.length;

  return (
    <div className="w-full min-h-full bg-[#FFEBF1] dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
            Find Adoptable Pets in the Philippines
          </h1>
          <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] mt-1">
            Browse rescued dogs and cats looking for permanent, loving homes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[#786875] dark:text-[#C9B8C7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pet by name, breed, color..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#231423] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs text-[#352633] dark:text-[#FCE4EC] outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#2A1A2A] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs font-bold text-[#352633] dark:text-[#FCE4EC] cursor-pointer shrink-0"
          >
            <Filter className="h-3.5 w-3.5 text-[#F4435A] dark:text-[#F48FB1]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F4435A] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block col-span-3 bg-white dark:bg-[#2A1A2A] rounded-3xl p-6 border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
            <span className="font-bold text-xs uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#F4435A] dark:text-[#F48FB1]" /> Filters
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-[#F4435A] dark:text-[#F48FB1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Species */}
          <div>
            <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Species</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: '', label: 'All' },
                { val: 'dog', label: '🐶 Dogs' },
                { val: 'cat', label: '🐱 Cats' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => updateFilter('species', opt.val || undefined)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    (species === opt.val || (!species && opt.val === ''))
                      ? 'bg-[#FFEBF1] dark:bg-[#382338] text-[#FF81AB] dark:text-[#F48FB1] border-[#FF81AB] dark:border-[#F48FB1] font-bold'
                      : 'border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:border-[#FF81AB]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Sex</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: '', label: 'Any' },
                { val: 'male', label: 'Male' },
                { val: 'female', label: 'Female' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => updateFilter('sex', opt.val || undefined)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    (sex === opt.val || (!sex && opt.val === ''))
                      ? 'bg-[#FFEBF1] dark:bg-[#382338] text-[#FF81AB] dark:text-[#F48FB1] border-[#FF81AB] dark:border-[#F48FB1] font-bold'
                      : 'border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:border-[#FF81AB]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Category */}
          <div>
            <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Age</label>
            <select
              value={age_category || ''}
              onChange={(e) => updateFilter('age_category', e.target.value || undefined)}
              className="w-full p-2 bg-[#FFEBF1]/50 dark:bg-[#231423] rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs font-semibold text-[#352633] dark:text-[#FCE4EC] focus:outline-none focus:ring-2 focus:ring-[#FF81AB]"
            >
              <option value="">All Ages</option>
              <option value="baby">Baby / Puppy / Kitten (&lt; 6 mos)</option>
              <option value="young">Young (6 mos - 2 yrs)</option>
              <option value="adult">Adult (2 - 7 yrs)</option>
              <option value="senior">Senior (7+ yrs)</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Size</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: '', label: 'Any' },
                { val: 'small', label: 'Small' },
                { val: 'medium', label: 'Med' },
                { val: 'large', label: 'Large' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => updateFilter('size', opt.val || undefined)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    (size === opt.val || (!size && opt.val === ''))
                      ? 'bg-[#FFEBF1] dark:bg-[#382338] text-[#FF81AB] dark:text-[#F48FB1] border-[#FF81AB] dark:border-[#F48FB1] font-bold'
                      : 'border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:border-[#FF81AB]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Municipality / Location Filter */}
          <div>
            <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Municipality / City</label>
            <select
              value={city || ''}
              onChange={(e) => updateFilter('city', e.target.value || undefined)}
              className="w-full p-2 bg-[#FFEBF1]/50 dark:bg-[#231423] rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs font-semibold text-[#352633] dark:text-[#FCE4EC] focus:outline-none focus:ring-2 focus:ring-[#FF81AB]"
            >
              <option value="">All Municipalities</option>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.location_type ? `(${loc.location_type})` : ''}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {locationsLoading ? 'Loading locations...' : 'No locations available'}
                </option>
              )}
            </select>
          </div>

          {/* Health toggles */}
          <div className="space-y-2 pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#352633] dark:text-[#FCE4EC]">
              <input
                type="checkbox"
                checked={is_vaccinated || false}
                onChange={(e) => updateFilter('is_vaccinated', e.target.checked || undefined)}
                className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>Vaccinated Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#352633] dark:text-[#FCE4EC]">
              <input
                type="checkbox"
                checked={is_sterilized || false}
                onChange={(e) => updateFilter('is_sterilized', e.target.checked || undefined)}
                className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>Spayed / Neutered Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#352633] dark:text-[#FCE4EC]">
              <input
                type="checkbox"
                checked={verified_shelter_only || false}
                onChange={(e) => updateFilter('verified_shelter_only', e.target.checked || undefined)}
                className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>Verified Shelters Only</span>
            </label>
          </div>
        </aside>

        {/* RESULTS AREA */}
        <main className="col-span-1 md:col-span-9 space-y-6">
          {/* Top Sort and Count bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-[#2A1A2A] p-3.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs shadow-xs">
            <span className="font-semibold text-[#786875] dark:text-[#C9B8C7]">
              Showing <span className="text-[#F4435A] dark:text-[#F48FB1] font-bold">{pets.length}</span> of {totalCount} adoptable animals
            </span>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-[#F1D5DF]/60 dark:border-[#4D2E4D]/60">
              <span className="text-[#786875] dark:text-[#C9B8C7]">Sort:</span>
              <select
                value={ordering}
                onChange={(e) => updateFilter('ordering', e.target.value)}
                className="bg-transparent font-bold text-[#352633] dark:text-[#FCE4EC] focus:outline-none cursor-pointer"
              >
                <option value="-created_at" className="bg-white dark:bg-[#2A1A2A]">Recently Listed</option>
                <option value="name" className="bg-white dark:bg-[#2A1A2A]">Name (A-Z)</option>
                <option value="age_years" className="bg-white dark:bg-[#2A1A2A]">Youngest First</option>
                <option value="-age_years" className="bg-white dark:bg-[#2A1A2A]">Oldest First</option>
              </select>
            </div>
          </div>

          {petsLoading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : petsError ? (
            <div className="bg-[#FCE4EC] dark:bg-[#382338] border border-[#F1D5DF] dark:border-[#4D2E4D] p-8 rounded-3xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-[#F4435A] mx-auto" />
              <p className="text-sm font-bold text-[#F4435A] dark:text-[#F48FB1]">
                Unable to load pet listings. Please ensure the SurFur backend server is running.
              </p>
              <Button size="sm" onClick={() => refetchPets()} className="font-bold">
                <RotateCcw className="h-4 w-4 mr-1.5" /> Try Again
              </Button>
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t.pets.noResults}
              description="Try adjusting or clearing your filters to discover more adoptable companions."
              action={
                <Button size="sm" onClick={clearAllFilters}>
                  {t.pets.clearFilters}
                </Button>
              }
            />
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-[#2A1A2A] h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <h3 className="font-bold text-[#352633] dark:text-[#FCE4EC]">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 cursor-pointer text-[#786875]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Species */}
            <div>
              <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Species</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: '', label: 'All' },
                  { val: 'dog', label: '🐶 Dogs' },
                  { val: 'cat', label: '🐱 Cats' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => updateFilter('species', opt.val || undefined)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      (species === opt.val || (!species && opt.val === ''))
                        ? 'bg-[#FFEBF1] dark:bg-[#382338] text-[#FF81AB] dark:text-[#F48FB1] border-[#FF81AB] font-bold'
                        : 'border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-xs font-bold text-[#352633] dark:text-[#FCE4EC] mb-2">Municipality / City</label>
              <select
                value={city || ''}
                onChange={(e) => updateFilter('city', e.target.value || undefined)}
                className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#231423] text-xs font-semibold text-[#352633] dark:text-[#FCE4EC]"
              >
                <option value="">All Municipalities</option>
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.location_type ? `(${loc.location_type})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {locationsLoading ? 'Loading locations...' : 'No locations available'}
                  </option>
                )}
              </select>
            </div>

            <Button
              className="w-full font-bold"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
