import { useQuery } from '@tanstack/react-query';
import { petsApi } from '../api/pets';
import { PetCard } from '../components/ui/PetCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { extractResults } from '../utils/apiHelpers';

export function FavoritesPage() {
  const { isAuthenticated } = useAuth();

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => petsApi.getFavorites(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <Heart className="h-12 w-12 text-[#F48FB1] mx-auto" />
        <h2 className="text-xl font-bold text-[#352633] dark:text-[#FCE4EC]">Sign In to View Favorites</h2>
        <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
          Save adoptable dogs and cats you are considering to keep track of their availability status.
        </p>
        <Link to="/login">
          <Button size="sm">Log In Now</Button>
        </Link>
      </div>
    );
  }

  const favorites = extractResults<any>(favoritesData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">Saved Favorites</h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] mt-1">
          Keep track of adoptable animals you are interested in.
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav: any) => (
            <PetCard key={fav.id} pet={fav.pet} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites saved yet"
          description="Click the heart icon on any pet card to add them to your saved companions."
          action={
            <Link to="/pets">
              <Button size="sm">Browse Adoptable Pets</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
