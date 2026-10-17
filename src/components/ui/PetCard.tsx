import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Building2 } from 'lucide-react';
import type { Pet } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { DEFAULT_PET_IMAGE, STATUS_COLORS } from '../../utils/constants';
import { formatAge } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { petsApi } from '../../api/pets';
import { useQueryClient } from '@tanstack/react-query';

interface PetCardProps {
  pet: Pet;
  onFavoriteToggle?: (petId: string, favorited: boolean) => void;
}

export function PetCard({ pet, onFavoriteToggle }: PetCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isFav, setIsFav] = React.useState(pet.is_favorited ?? false);
  const [favLoading, setFavLoading] = React.useState(false);

  const primaryImage = pet.primary_image?.image_url || DEFAULT_PET_IMAGE;
  const statusClass = STATUS_COLORS[pet.adoption_status] || STATUS_COLORS.unavailable;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setFavLoading(true);
    try {
      const result = await petsApi.toggleFavorite(pet.id);
      setIsFav(result.favorited);
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      onFavoriteToggle?.(pet.id, result.favorited);
    } catch (err) {
      console.error('Favorite toggle failed', err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#2A1A2A] rounded-2xl shadow-xs border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group">
      <div className="relative aspect-4/3 overflow-hidden bg-[#FCE4EC]/50 dark:bg-[#382338]">
        <img
          src={primaryImage}
          alt={pet.primary_image?.alt_text || `${pet.name} the ${pet.species}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-[#2A1A2A]/90 backdrop-blur-xs rounded-full shadow hover:bg-white dark:hover:bg-[#382338] transition-colors cursor-pointer"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFav ? 'fill-[#F4435A] text-[#F4435A]' : 'text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A]'
            }`}
          />
        </button>
        <div className="absolute top-3 left-3">
          <Badge className={statusClass}>
            {pet.adoption_status === 'available'
              ? 'Available'
              : pet.adoption_status === 'pending'
              ? 'Pending'
              : pet.adoption_status === 'adopted'
              ? 'Adopted'
              : pet.adoption_status}
          </Badge>
        </div>
        {pet.shelter?.is_demo && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="pink">DEMO</Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-lg font-bold text-[#352633] dark:text-[#FCE4EC]">{pet.name}</h3>
            <span className="text-base" title={pet.species}>
              {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="gray">
              {pet.sex !== 'unknown' ? pet.sex.charAt(0).toUpperCase() + pet.sex.slice(1) : 'Unknown'}
            </Badge>
            <Badge variant="gray">{formatAge(pet.age_years, pet.age_months)}</Badge>
            {pet.size !== 'unknown' && (
              <Badge variant="gray">
                {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)} size
              </Badge>
            )}
          </div>

          {pet.breed && <p className="text-xs text-[#786875] dark:text-[#C9B8C7] mb-2 truncate">{pet.breed}</p>}

          <div className="space-y-1 mb-4 text-xs text-[#786875] dark:text-[#C9B8C7]">
            {pet.city_name && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-[#E94EAA] shrink-0" />
                <span className="truncate">{pet.city_name}, Cebu</span>
              </div>
            )}
            {pet.shelter_name && (
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                <span className="truncate">{pet.shelter_name}</span>
              </div>
            )}
          </div>
        </div>

        <Link to={`/pets/${pet.id}`} className="block mt-2">
          <button className="w-full py-2 px-3 bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF81AB]">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
