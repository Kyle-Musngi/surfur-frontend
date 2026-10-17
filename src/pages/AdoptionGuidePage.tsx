import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '../api/articles';
import { Spinner } from '../components/ui/Spinner';
import { BookOpen, ShieldAlert } from 'lucide-react';

export function AdoptionGuidePage() {
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesApi.list(),
  });

  const articles = articlesData?.results || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] text-xs font-bold">
          <BookOpen className="h-3.5 w-3.5" /> Educational Resources
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Responsible Adoption & Pet Care Guide
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
          Helpful guidance on preparing your home, nutrition, vet schedules, and caring for rescued Aspins and Puspins in Cebu.
        </p>
      </div>

      <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Veterinary Disclaimer:</strong> The articles and advice on this platform are for general educational purposes. Always consult a licensed veterinarian in Cebu for personalized diagnoses and medical treatment.
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map((art) => (
            <article key={art.id} className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#786875] dark:text-[#C9B8C7]">
                <span className="font-bold text-[#F4435A] dark:text-[#F48FB1] px-2 py-0.5 rounded-md bg-[#FCE4EC] dark:bg-[#382338]">
                  {art.category_name}
                </span>
                <span>•</span>
                <span>{new Date(art.published_at).toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">{art.title}</h2>
              <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed font-medium">
                {art.excerpt}
              </p>
              {art.content && (
                <div className="pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D] text-xs sm:text-sm text-[#352633] dark:text-[#FCE4EC] leading-relaxed whitespace-pre-line space-y-3">
                  {art.content}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center text-xs text-[#786875] dark:text-[#C9B8C7]">
          Educational guides are currently being prepared by the Cebu welfare team.
        </div>
      )}
    </div>
  );
}
