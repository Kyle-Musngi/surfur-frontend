import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { sheltersApi } from '../../api/shelters';
import { petsApi } from '../../api/pets';
import { adoptionsApi } from '../../api/adoptions';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS } from '../../utils/constants';
import {
  Plus,
  FileText,
  Eye,
  FileCheck,
  Home,
  X,
} from 'lucide-react';
import type { AdoptionInquiry } from '../../types';

export function ShelterDashboard() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'pets' | 'inquiries'>('overview');
  const [newPetModalOpen, setNewPetModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<AdoptionInquiry | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New Pet Form state
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'dog' | 'cat'>('dog');
  const [petBreed, setPetBreed] = useState('Aspin');
  const [petSex, setPetSex] = useState<'male' | 'female'>('male');
  const [petSize, setPetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [petAgeYears, setPetAgeYears] = useState(1);
  const [petDesc, setPetDesc] = useState('');
  const [petVaccinated, setPetVaccinated] = useState(true);
  const [petSterilized, setPetSterilized] = useState(true);
  const [petSaving, setPetSaving] = useState(false);
  const [petSuccess, setPetSuccess] = useState(false);

  // 1. Fetch shelters owned or administered by user
  const { data: sheltersData, isLoading: sheltersLoading } = useQuery({
    queryKey: ['myShelters'],
    queryFn: () => sheltersApi.list(),
    enabled: isAuthenticated,
  });

  const myShelter = sheltersData?.results?.[0] || null;

  // 2. Fetch pets for shelter
  const { data: shelterPets = [], refetch: refetchPets } = useQuery({
    queryKey: ['shelterPets', myShelter?.slug],
    queryFn: () => petsApi.getShelterPets(myShelter!.slug),
    enabled: !!myShelter?.slug,
  });

  // 3. Fetch inquiries for shelter
  const { data: inquiriesData = [], refetch: refetchInquiries } = useQuery({
    queryKey: ['shelterInquiries', myShelter?.slug],
    queryFn: () => adoptionsApi.getShelterInquiries(myShelter!.slug),
    enabled: !!myShelter?.slug,
  });

  const petsList = Array.isArray(shelterPets) ? shelterPets : (shelterPets as any).results || [];
  const inquiriesList = Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData as any).results || [];

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myShelter) return;
    setPetSaving(true);
    try {
      await petsApi.create(myShelter.slug, {
        name: petName,
        species: petSpecies,
        breed: petBreed,
        sex: petSex,
        size: petSize,
        age_years: petAgeYears,
        description: petDesc,
        is_vaccinated: petVaccinated,
        is_sterilized: petSterilized,
        is_published: true,
      });
      setPetSuccess(true);
      refetchPets();
      setTimeout(() => {
        setPetSuccess(false);
        setNewPetModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to create pet', err);
    } finally {
      setPetSaving(false);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      await adoptionsApi.updateStatus(inquiryId, {
        status,
        notes: actionNotes,
      });
      refetchInquiries();
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry((prev: any) => ({ ...prev, status, shelter_notes: actionNotes }));
      }
      setActionNotes('');
    } catch (err) {
      console.error('Failed to update inquiry status', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 text-center text-xs text-[#786875] dark:text-[#C9B8C7]">
        Please sign in with a Shelter Administrator account.
      </div>
    );
  }

  if (sheltersLoading) return <Spinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">Shelter Dashboard</h1>
            {myShelter?.verification_status === 'verified' ? (
              <Badge variant="mint">Verified Partner</Badge>
            ) : (
              <Badge variant="pink">Verification Pending</Badge>
            )}
          </div>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] mt-1">
            Managing: <strong>{myShelter ? myShelter.name : 'No registered shelter associated yet'}</strong>
          </p>
        </div>

        {myShelter && (
          <Button size="sm" onClick={() => setNewPetModalOpen(true)} className="text-xs font-bold">
            <Plus className="h-4 w-4 mr-1" /> Add Animal Listing
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#F1D5DF] dark:border-[#4D2E4D] text-xs font-bold">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'pets', label: `🐾 Manage Animals (${petsList.length})` },
          { id: 'inquiries', label: `📥 Applications (${inquiriesList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#F4435A] text-[#F4435A] dark:text-[#F48FB1] dark:border-[#F48FB1] font-black'
                : 'border-transparent text-[#786875] dark:text-[#C9B8C7] hover:text-[#352633] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#2A1A2A] p-5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs">
              <span className="text-xs text-[#786875] dark:text-[#C9B8C7] font-bold uppercase">Active Listings</span>
              <p className="text-3xl font-black text-[#F4435A] dark:text-[#F48FB1] mt-1">{petsList.length}</p>
            </div>
            <div className="bg-white dark:bg-[#2A1A2A] p-5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs">
              <span className="text-xs text-[#786875] dark:text-[#C9B8C7] font-bold uppercase">Total Applications</span>
              <p className="text-3xl font-black text-[#E94EAA] mt-1">{inquiriesList.length}</p>
            </div>
            <div className="bg-white dark:bg-[#2A1A2A] p-5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs">
              <span className="text-xs text-[#786875] dark:text-[#C9B8C7] font-bold uppercase">Pending Screening</span>
              <p className="text-3xl font-black text-[#F4435A] mt-1">
                {inquiriesList.filter((i: any) => i.status === 'submitted' || i.status === 'under_review').length}
              </p>
            </div>
          </div>

          <div className="bg-[#FCE4EC]/50 dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs space-y-2 shadow-xs">
            <h4 className="font-bold text-[#352633] dark:text-[#FCE4EC] text-sm">SurFur Application Screening Guidelines</h4>
            <p className="text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
              As an authorized shelter administrator, verify that applicants satisfy the 18+ legal age threshold, review landlord or homeownership clearances, and schedule a video or in-person screening before approving the adoption covenant.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PETS MANAGEMENT */}
      {activeTab === 'pets' && (
        <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#F1D5DF] dark:border-[#4D2E4D] flex justify-between items-center text-xs">
            <span className="font-bold text-[#352633] dark:text-[#FCE4EC]">Animal Listings Belonging Exclusively to this Shelter</span>
            <Button size="sm" onClick={() => setNewPetModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> New Listing
            </Button>
          </div>

          {petsList.length > 0 ? (
            <div className="divide-y divide-[#F1D5DF] dark:divide-[#4D2E4D] text-xs">
              {petsList.map((p: any) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.primary_image?.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop&q=80'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-[#352633] dark:text-[#FCE4EC]">{p.name}</h4>
                      <p className="text-[#786875] dark:text-[#C9B8C7] text-[11px] capitalize">{p.species} • {p.breed || 'Aspin/Puspin'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF5D5] text-[#224424] dark:bg-[#253826] dark:text-[#DDF5D5] uppercase">
                      {p.adoption_status}
                    </span>
                    <a
                      href={`/pets/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] font-bold"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#786875] dark:text-[#C9B8C7] text-xs">
              No animal listings found for this shelter yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INQUIRIES & APPLICATION WORKFLOW */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiriesList.length > 0 ? (
            inquiriesList.map((inq: any) => (
              <div key={inq.id} className="bg-white dark:bg-[#2A1A2A] p-6 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#F4435A] dark:text-[#F48FB1]">
                        {inq.reference_number || 'APP-PENDING'}
                      </span>
                      <span className="text-stone-300 dark:text-stone-600">•</span>
                      <span className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#352633] dark:text-[#FCE4EC] mt-0.5">{inq.applicant_name}</h3>
                    <p className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                      Applying to adopt: <strong className="text-[#F4435A] dark:text-[#F48FB1]">{inq.pet_name}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${INQUIRY_STATUS_COLORS[inq.status] || 'bg-stone-100'}`}>
                      {INQUIRY_STATUS_LABELS[inq.status] || inq.status}
                    </span>
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-3 py-1.5 rounded-xl bg-[#F4435A] hover:bg-[#C62845] text-white font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Documents
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[#352633] dark:text-[#FCE4EC] bg-[#FCE4EC]/40 dark:bg-[#231423] p-3.5 rounded-2xl border border-[#F1D5DF]/60 dark:border-[#4D2E4D]">
                  <div>
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Contact</span>
                    <span>{inq.applicant_email}</span>
                    <span className="block text-[11px] text-[#786875] dark:text-[#C9B8C7]">{inq.applicant_phone || 'No phone'}</span>
                  </div>
                  <div>
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Date of Birth / Age</span>
                    <span className="font-semibold text-[#352633] dark:text-[#FCE4EC]">
                      {inq.date_of_birth || 'Verified 18+'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Housing Type</span>
                    <span className="capitalize font-semibold text-[#352633] dark:text-[#FCE4EC]">
                      {inq.housing_type || 'Standard'}
                    </span>
                    <span className="block text-[10px] text-[#786875] dark:text-[#C9B8C7] capitalize">{inq.living_situation?.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Occupation</span>
                    <span>{inq.occupation || 'Self-reported'}</span>
                  </div>
                </div>

                {inq.shelter_notes && (
                  <div className="p-3 bg-[#FCE4EC] dark:bg-[#382338] rounded-xl text-[#F4435A] dark:text-[#F48FB1] text-xs border border-[#F1D5DF] dark:border-[#4D2E4D]">
                    <strong>Internal Staff Notes:</strong> {inq.shelter_notes}
                  </div>
                )}

                {/* Quick Status Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#786875] dark:text-[#C9B8C7] mr-2">Quick Action:</span>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'under_review')}
                    className="px-3 py-1 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold hover:bg-amber-100 cursor-pointer"
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'more_info')}
                    className="px-3 py-1 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    Request More Info
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'visit_requested')}
                    className="px-3 py-1 rounded-xl border border-[#F1D5DF] bg-[#FCE4EC] dark:bg-[#382338] text-[#E94EAA] font-bold hover:bg-[#FCE4EC]/80 cursor-pointer"
                  >
                    Request Visit
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'approved')}
                    className="px-3 py-1 rounded-xl border border-[#c0e8b3] bg-[#DDF5D5] dark:bg-[#253826] text-[#224424] dark:text-[#DDF5D5] font-bold hover:bg-[#c9ecc0] cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'declined')}
                    className="px-3 py-1 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center text-[#786875] dark:text-[#C9B8C7] text-xs">
              No applications received for your shelter yet.
            </div>
          )}
        </div>
      )}

      {/* FULL APPLICATION & DOCUMENT INSPECTION MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <div>
                <span className="font-mono text-xs font-bold text-[#F4435A] dark:text-[#F48FB1]">
                  {selectedInquiry.reference_number || 'APP-PENDING'}
                </span>
                <h3 className="text-xl font-black text-[#352633] dark:text-[#FCE4EC]">
                  Application Review: {selectedInquiry.applicant_name}
                </h3>
                <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
                  Pet requested: <strong>{selectedInquiry.pet_name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg text-[#786875] hover:text-[#352633] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Applicant Profile Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FCE4EC]/40 dark:bg-[#231423] p-4 rounded-2xl border border-[#F1D5DF]/60 dark:border-[#4D2E4D]">
              <div>
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Date of Birth</span>
                <strong className="text-[#352633] dark:text-[#FCE4EC]">{selectedInquiry.date_of_birth || 'Self-verified 18+'}</strong>
              </div>
              <div>
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Occupation</span>
                <strong className="text-[#352633] dark:text-[#FCE4EC]">{selectedInquiry.occupation || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Housing Type</span>
                <strong className="text-[#352633] dark:text-[#FCE4EC] capitalize">{selectedInquiry.housing_type || 'Homeowner'}</strong>
              </div>
              <div>
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Current Status</span>
                <Badge className={INQUIRY_STATUS_COLORS[selectedInquiry.status] || 'bg-stone-100'}>
                  {INQUIRY_STATUS_LABELS[selectedInquiry.status] || selectedInquiry.status}
                </Badge>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                Uploaded Screening Documents & Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* ID */}
                <div className="p-3 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
                    <span>Proof of Identification</span>
                  </div>
                  {selectedInquiry.proof_of_id ? (
                    <a
                      href={selectedInquiry.proof_of_id}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] font-bold"
                    >
                      View ID ↗
                    </a>
                  ) : (
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">Not uploaded</span>
                  )}
                </div>

                {/* Housing */}
                <div className="p-3 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
                    <span>Housing Proof / Landlord Consent</span>
                  </div>
                  {selectedInquiry.proof_of_housing ? (
                    <a
                      href={selectedInquiry.proof_of_housing}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] font-bold"
                    >
                      View Document ↗
                    </a>
                  ) : (
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">Not uploaded</span>
                  )}
                </div>

                {/* Income */}
                <div className="p-3 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
                    <span>Proof of Income / Financials</span>
                  </div>
                  {selectedInquiry.proof_of_income ? (
                    <a
                      href={selectedInquiry.proof_of_income}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] font-bold"
                    >
                      View Proof ↗
                    </a>
                  ) : (
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">Not uploaded</span>
                  )}
                </div>

                {/* Home environment media */}
                <div className="p-3 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
                    <span>Home Walkthrough Media</span>
                  </div>
                  {selectedInquiry.home_environment_media ? (
                    <a
                      href={selectedInquiry.home_environment_media}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] font-bold"
                    >
                      View Media ↗
                    </a>
                  ) : (
                    <span className="text-[#786875] dark:text-[#C9B8C7] text-[11px]">Not uploaded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Internal Notes & Status Update Controls */}
            <div className="space-y-3 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] text-xs">
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC]">
                Staff Internal Notes & Evaluation:
              </label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter notes on applicant screening, phone interview notes, or visit schedule..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
              />

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="font-bold text-[#352633] dark:text-[#FCE4EC] mr-2">Set Application Status:</span>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'under_review')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer"
                >
                  Under Review
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'more_info')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Request More Info
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'visit_requested')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E94EAA] hover:bg-[#d43795] text-white font-bold cursor-pointer"
                >
                  Request Visit
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'approved')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#20523d] text-white font-bold cursor-pointer"
                >
                  Approve Application
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'declined')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F4435A] hover:bg-[#C62845] text-white font-bold cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PET MODAL */}
      {newPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex justify-between items-center pb-2 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <h3 className="font-black text-base text-[#352633] dark:text-[#FCE4EC]">Add Adoptable Animal</h3>
              <button onClick={() => setNewPetModalOpen(false)}>
                <X className="h-5 w-5 text-[#786875]" />
              </button>
            </div>

            {petSuccess ? (
              <div className="py-6 text-center text-[#F4435A] dark:text-[#F48FB1] font-bold">
                ✓ Pet listed successfully!
              </div>
            ) : (
              <form onSubmit={handleCreatePet} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                    placeholder="e.g. Bantay, Muning"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Species</label>
                    <select
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value as any)}
                      className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
                    >
                      <option value="dog">Dog (Aspin)</option>
                      <option value="cat">Cat (Puspin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Breed</label>
                    <input
                      type="text"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Sex</label>
                    <select
                      value={petSex}
                      onChange={(e) => setPetSex(e.target.value as any)}
                      className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Size</label>
                    <select
                      value={petSize}
                      onChange={(e) => setPetSize(e.target.value as any)}
                      className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Age (Years)</label>
                    <input
                      type="number"
                      min={0}
                      value={petAgeYears}
                      onChange={(e) => setPetAgeYears(Number(e.target.value))}
                      className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#352633] dark:text-[#FCE4EC]">Description / Temperament</label>
                  <textarea
                    rows={2}
                    value={petDesc}
                    onChange={(e) => setPetDesc(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC]"
                  />
                </div>

                <div className="flex gap-4 pt-1 text-[#352633] dark:text-[#FCE4EC]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={petVaccinated}
                      onChange={(e) => setPetVaccinated(e.target.checked)}
                      className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>Vaccinated</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={petSterilized}
                      onChange={(e) => setPetSterilized(e.target.checked)}
                      className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>Spayed/Neutered</span>
                  </label>
                </div>

                <Button type="submit" size="md" className="w-full font-bold" isLoading={petSaving}>
                  Publish Listing
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
