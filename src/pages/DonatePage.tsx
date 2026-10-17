import { useQuery } from '@tanstack/react-query';
import { donationsApi } from '../api/donations';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Heart, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function DonatePage() {
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => donationsApi.list(),
  });

  const campaigns = campaignsData?.results || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] text-xs font-bold">
          <Heart className="h-3.5 w-3.5 fill-[#F4435A]" /> Transparent Welfare Giving
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Support Verified Cebu Rescues & Animals
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
          Help independent shelters, spay/neuter outreach programs, and emergency medical treatments across Cebu.
        </p>
      </div>

      {/* DEV MODE NOTICE */}
      <div className="bg-white dark:bg-[#2A1A2A] p-4 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs text-[#786875] dark:text-[#C9B8C7] flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[#F4435A] dark:text-[#F48FB1] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#352633] dark:text-[#FCE4EC]">Payment Gateway Integration Note (Development Mode):</span>
          <p className="text-[11px] mt-0.5 text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
            In compliance with platform rules, online payment processing (e.g. PayMongo or GCash) is currently in developer test mode. No live funds are accepted without merchant credentials. Direct donation channels can be verified directly on each shelter's verified profile.
          </p>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white dark:bg-[#2A1A2A] rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-52 bg-stone-100 dark:bg-stone-900 relative">
                  <img
                    src={camp.cover_image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=300&fit=crop&q=80'}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-[#1E121E]/90 backdrop-blur-xs rounded-full text-xs font-bold text-[#F4435A] dark:text-[#F48FB1] shadow-xs">
                    {camp.shelter_name}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">{camp.title}</h3>
                  <p className="text-xs text-[#786875] dark:text-[#C9B8C7] line-clamp-3 leading-relaxed">{camp.description}</p>

                  <div className="p-3 bg-[#FCE4EC]/40 dark:bg-[#382338]/50 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#786875] dark:text-[#C9B8C7]">Intended Purpose</span>
                    <p className="text-xs text-[#352633] dark:text-[#FCE4EC] leading-relaxed">{camp.purpose}</p>
                  </div>

                  {camp.target_amount && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#786875] dark:text-[#C9B8C7]">Raised: ₱{Number(camp.confirmed_amount).toLocaleString()}</span>
                        <span className="text-[#F4435A] dark:text-[#F48FB1]">Goal: ₱{Number(camp.target_amount).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#FFEBF1] dark:bg-[#382338] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F4435A] rounded-full"
                          style={{ width: `${Math.min(100, camp.progress_percent || 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#786875] dark:text-[#C9B8C7] text-right block">
                        {camp.progress_percent || 0}% funded
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  size="md"
                  className="w-full font-bold bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent transition-all shadow-xs"
                  onClick={() => alert('Development notice: Payment gateway awaiting merchant key configuration. Please donate directly to the verified shelter.')}
                >
                  <Heart className="h-4 w-4 mr-1.5 fill-[#352633] dark:fill-white text-[#352633] dark:text-white" /> Sponsor This Campaign (Dev Mode)
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No active fundraising campaigns at this time" />
      )}
    </div>
  );
}
