import { useQuery } from '@tanstack/react-query';
import { adoptionsApi } from '../api/adoptions';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS } from '../utils/constants';
import { FileText, Clock, Building2 } from 'lucide-react';

export function MyInquiriesPage() {
  const { isAuthenticated } = useAuth();

  const { data: inquiriesData, isLoading } = useQuery({
    queryKey: ['myInquiries'],
    queryFn: () => adoptionsApi.getMyInquiries(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <FileText className="h-12 w-12 text-[#F48FB1] mx-auto" />
        <h2 className="text-xl font-bold text-[#352633] dark:text-[#FCE4EC]">Sign In to View Applications</h2>
        <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
          Track the screening status and communications for adoption applications you've submitted.
        </p>
        <Link to="/login">
          <Button size="sm">Log In Now</Button>
        </Link>
      </div>
    );
  }

  const inquiries = (inquiriesData as any)?.results || (Array.isArray(inquiriesData) ? inquiriesData : []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">My Adoption Applications</h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] mt-1">
          Follow your application screening progress with verified rescue shelters.
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inq: any) => (
            <div
              key={inq.id}
              className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F4435A] dark:text-[#F48FB1]">
                      {inq.reference_number || 'APP-RECEIVED'}
                    </span>
                    <span className="text-[#786875] dark:text-[#C9B8C7]">•</span>
                    <h3 className="font-bold text-base text-[#352633] dark:text-[#FCE4EC]">{inq.pet_name}</h3>
                  </div>
                  <p className="text-xs text-[#786875] dark:text-[#C9B8C7] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#F4435A] dark:text-[#F48FB1]" />
                    Holding Shelter: <strong className="text-[#352633] dark:text-[#FCE4EC]">{inq.shelter_name}</strong>
                  </p>
                  <p className="text-[11px] text-[#786875] dark:text-[#C9B8C7] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Submitted on {new Date(inq.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${INQUIRY_STATUS_COLORS[inq.status] || 'bg-[#FCE4EC] text-[#F4435A]'}`}>
                    {INQUIRY_STATUS_LABELS[inq.status] || inq.status}
                  </span>
                </div>
              </div>

              {inq.shelter_notes && (
                <div className="p-3 bg-[#FCE4EC]/50 dark:bg-[#382338]/60 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs text-[#352633] dark:text-[#FCE4EC]">
                  <span className="font-bold block mb-0.5 text-[#F4435A] dark:text-[#F48FB1]">Shelter Coordinator Update:</span>
                  <span>{inq.shelter_notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No adoption applications yet"
          description="When you apply to adopt a rescued animal, your application progress and reference number will appear here."
          action={
            <Link to="/pets">
              <Button size="sm">Find an Animal to Adopt</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
