import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { extractResults } from '../utils/apiHelpers';
import { Calendar, MapPin, ExternalLink, Building2, Clock } from 'lucide-react';
import type { Event } from '../types';

export function EventsPage() {
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApi.list(),
  });

  const events = extractResults<Event>(eventsData);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Adoption Drives & Animal Welfare Events
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] mt-1">
          Join community adoption fairs, low-cost spay/neuter clinics, and volunteer drives in Cebu.
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white dark:bg-[#2A1A2A] rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-48 bg-stone-100 dark:bg-stone-900 relative">
                  <img
                    src={ev.cover_photo || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop&q=80'}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-[#1E121E]/90 backdrop-blur-xs rounded-full text-xs font-black text-[#F4435A] dark:text-[#F48FB1] shadow-xs">
                    {ev.event_type.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FF81AB] dark:text-[#F48FB1]">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(ev.start_datetime).toLocaleDateString('en-PH', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">{ev.title}</h3>
                  <p className="text-xs text-[#786875] dark:text-[#C9B8C7] line-clamp-3 leading-relaxed">{ev.description}</p>

                  <div className="pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] space-y-1.5 text-xs text-[#786875] dark:text-[#C9B8C7]">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                      <span>{ev.venue_name || 'Cebu Venue'} ({ev.venue_address || 'Cebu City'})</span>
                    </div>
                    {ev.host_shelter_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                        <span>Organized by {ev.host_shelter_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {ev.registration_link && (
                <div className="p-6 pt-0">
                  <a
                    href={ev.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2.5 px-4 bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    RSVP / Register Attendance
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No upcoming adoption drives listed"
          description="Check back soon for upcoming pet adoption weekends and community clinics across Cebu."
        />
      )}
    </div>
  );
}
