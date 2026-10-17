import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { petsApi } from '../api/pets';
import { PetCard } from '../components/ui/PetCard';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Sparkles, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import type { Pet } from '../types';

export function PetQuizPage() {
  const [species, setSpecies] = useState<'dog' | 'cat' | 'any'>('any');
  const [livingSpace, setLivingSpace] = useState<'apartment' | 'house_yard' | 'any'>('any');
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [hasKids, setHasKids] = useState<boolean | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'experienced'>('beginner');
  const [submitted, setSubmitted] = useState(false);

  const { data: petsData, isLoading } = useQuery({
    queryKey: ['pets', 'quiz'],
    queryFn: () => petsApi.list({ adoption_status: 'available' }),
  });

  const allPets = petsData?.results || [];

  // Quiz scoring algorithm
  const getMatchScore = (pet: Pet) => {
    let score = 50; // base score
    const reasons: string[] = [];

    // Species
    if (species !== 'any') {
      if (pet.species === species) {
        score += 25;
        reasons.push(`Matches your preference for a ${species}`);
      } else {
        score -= 40;
      }
    } else {
      reasons.push('Compatible with your flexible species preference');
    }

    // Kids
    if (hasKids === true) {
      if (pet.good_with_children === true) {
        score += 20;
        reasons.push('Documented to be great with children');
      } else if (pet.good_with_children === false) {
        score -= 30;
      }
    }

    // Living space & size
    if (livingSpace === 'apartment') {
      if (pet.size === 'small' || pet.species === 'cat') {
        score += 15;
        reasons.push('Compact size ideal for condominium or apartment living');
      } else if (pet.size === 'large') {
        score -= 10;
      }
    } else if (livingSpace === 'house_yard' && pet.size === 'large') {
      score += 15;
      reasons.push('Has plenty of yard space to thrive');
    }

    // Beginner friendly
    if (experienceLevel === 'beginner') {
      if (!pet.has_special_needs && pet.age_category === 'adult') {
        score += 10;
        reasons.push('Gentle adult temperament suited for first-time adopters');
      }
    }

    return { score: Math.max(10, Math.min(99, score)), reasons };
  };

  const matches = allPets
    .map((pet) => ({ pet, ...getMatchScore(pet) }))
    .filter((m) => m.score >= 50)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Lifestyle Pet Matcher
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Find Your Perfect Cebu Rescue Match
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] max-w-lg mx-auto">
          Answer 5 quick lifestyle questions. We'll recommend adoptable dogs and cats currently waiting in Cebu shelters.
        </p>
      </div>

      {/* QUIZ FORM */}
      <div className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-sm space-y-6">
        {/* Q1: Species */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#352633] dark:text-[#FCE4EC] mb-2">
            1. Are you looking to adopt a dog or a cat?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'dog', label: '🐶 Dog (Aspin)' },
              { val: 'cat', label: '🐱 Cat (Puspin)' },
              { val: 'any', label: '🐾 Open to Either' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setSpecies(opt.val as any)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  species === opt.val
                    ? 'bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] border-[#F4435A] dark:border-[#F48FB1] ring-2 ring-[#F48FB1]/30'
                    : 'bg-white dark:bg-[#231423] border-[#F1D5DF] dark:border-[#4D2E4D] text-[#352633] dark:text-[#FCE4EC] hover:border-[#F48FB1]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Living space */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#352633] dark:text-[#FCE4EC] mb-2">
            2. What describes your living setup in Cebu?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'apartment', label: '🏢 Apartment / Condo' },
              { val: 'house_yard', label: '🏡 House with Yard' },
              { val: 'any', label: '🏠 Standard Residential' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setLivingSpace(opt.val as any)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  livingSpace === opt.val
                    ? 'bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] border-[#F4435A] dark:border-[#F48FB1] ring-2 ring-[#F48FB1]/30'
                    : 'bg-white dark:bg-[#231423] border-[#F1D5DF] dark:border-[#4D2E4D] text-[#352633] dark:text-[#FCE4EC] hover:border-[#F48FB1]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Activity */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#352633] dark:text-[#FCE4EC] mb-2">
            3. What is your typical activity & exercise routine?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'low', label: '🛋️ Calm & Relaxed' },
              { val: 'moderate', label: '🚶 Daily Casual Walks' },
              { val: 'high', label: '🏃 Active / Outdoor' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setActivityLevel(opt.val as any)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  activityLevel === opt.val
                    ? 'bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] border-[#F4435A] dark:border-[#F48FB1] ring-2 ring-[#F48FB1]/30'
                    : 'bg-white dark:bg-[#231423] border-[#F1D5DF] dark:border-[#4D2E4D] text-[#352633] dark:text-[#FCE4EC] hover:border-[#F48FB1]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q4: Children in home */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#352633] dark:text-[#FCE4EC] mb-2">
            4. Are there young children (&lt; 10 years old) living with you?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: true, label: '👶 Yes, children in household' },
              { val: false, label: '🧑 No young kids / Adult home' },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setHasKids(opt.val)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  hasKids === opt.val
                    ? 'bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] border-[#F4435A] dark:border-[#F48FB1] ring-2 ring-[#F48FB1]/30'
                    : 'bg-white dark:bg-[#231423] border-[#F1D5DF] dark:border-[#4D2E4D] text-[#352633] dark:text-[#FCE4EC] hover:border-[#F48FB1]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <Button
            size="lg"
            className="w-full bg-[#F4435A] hover:bg-[#C62845] text-white font-bold shadow-md shadow-[#F4435A]/20 transition-all border-0"
            onClick={() => setSubmitted(true)}
          >
            Calculate Compatibility Matches
          </Button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {submitted && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
            <h2 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">
              Recommended Companions ({matches.length})
            </h2>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Adjust Answers
            </button>
          </div>

          {isLoading ? (
            <Spinner />
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map(({ pet, score, reasons }) => (
                <div key={pet.id} className="bg-white dark:bg-[#2A1A2A] rounded-3xl p-5 border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1]">
                        {score}% Compatibility Match
                      </span>
                      <span className="text-xs text-[#786875] dark:text-[#C9B8C7]">{pet.city_name || 'Cebu'}</span>
                    </div>

                    <PetCard pet={pet} />

                    <div className="mt-4 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-[#786875] dark:text-[#C9B8C7]">Why this match:</span>
                      {reasons.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-[#786875] dark:text-[#C9B8C7]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#F4435A] dark:text-[#F48FB1] shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#2A1A2A] rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] text-xs">
              No exact compatibility matches found. Try broadening your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
