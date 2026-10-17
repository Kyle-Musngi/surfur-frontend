import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { petsApi } from '../api/pets';
import { adoptionsApi } from '../api/adoptions';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_PET_IMAGE, STATUS_COLORS } from '../utils/constants';
import { formatAge } from '../utils/formatters';
import {
  Share2,
  MapPin,
  CheckCircle,
  Send,
  ArrowLeft,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Inquiry form states
  const [applicantName, setApplicantName] = useState(user?.full_name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone_number || '');
  const [applicantCity, setApplicantCity] = useState(user?.city || 'Cebu City');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contactPreference, setContactPreference] = useState('email');
  const [housingType, setHousingType] = useState<'homeowner' | 'renter'>('homeowner');
  const [livingSituation, setLivingSituation] = useState('house_yard');
  
  // Experience & Vet Reference
  const [hasExistingPets, setHasExistingPets] = useState(false);
  const [existingPetsDesc, setExistingPetsDesc] = useState('');
  const [hasOwnedPetsBefore, setHasOwnedPetsBefore] = useState(false);
  const [vetReferenceName, setVetReferenceName] = useState('');
  const [vetReferenceContact, setVetReferenceContact] = useState('');

  // Files
  const [idFile, setIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [housingFile, setHousingFile] = useState<File | null>(null);
  const [homeMediaFile, setHomeMediaFile] = useState<File | null>(null);

  // Household & Commitments
  const [hasChildren, setHasChildren] = useState(false);
  const [experience, setExperience] = useState('');
  const [reason, setReason] = useState('');
  const [longTermConsent, setLongTermConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [adoptionAgreement, setAdoptionAgreement] = useState(false);

  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ reference_number: string } | null>(null);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const { data: pet, isLoading, isError } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petsApi.detail(id!),
    enabled: !!id,
  });

  // Calculate Age in real-time
  const calculatedAge = useMemo(() => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, [dateOfBirth]);

  const isUnderage = calculatedAge !== null && calculatedAge < 18;

  if (isLoading) return <Spinner size="lg" />;
  if (isError || !pet) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <ErrorMessage message="Could not load animal profile. The listing may have been adopted or removed." />
        <Link to="/pets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Pet Directory
          </Button>
        </Link>
      </div>
    );
  }

  const images = pet.images && pet.images.length > 0
    ? pet.images
    : [{ id: 'default', image_url: DEFAULT_PET_IMAGE, alt_text: pet.name, is_primary: true, display_order: 0 }];

  const currentDisplayImg = selectedImage || images[0]?.image_url || DEFAULT_PET_IMAGE;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);

    if (!dateOfBirth) {
      setInquiryError('Date of birth is required to verify legal adoption age.');
      return;
    }

    if (calculatedAge !== null && calculatedAge < 18) {
      setInquiryError('Applicants must be at least 18 years old to adopt an animal under Philippine legal regulations.');
      return;
    }

    if (!privacyConsent || !adoptionAgreement || !longTermConsent) {
      setInquiryError('You must agree to all required consent terms.');
      return;
    }

    setSubmittingInquiry(true);
    try {
      const formData = new FormData();
      formData.append('pet', pet.id);
      formData.append('applicant_name', applicantName);
      formData.append('applicant_email', applicantEmail);
      formData.append('applicant_phone', applicantPhone);
      formData.append('applicant_city', applicantCity);
      formData.append('date_of_birth', dateOfBirth);
      formData.append('occupation', occupation);
      formData.append('contact_preference', contactPreference);
      formData.append('housing_type', housingType);
      formData.append('living_situation', livingSituation);
      formData.append('has_existing_pets', String(hasExistingPets));
      formData.append('existing_pets_description', existingPetsDesc);
      formData.append('has_owned_pets_before', String(hasOwnedPetsBefore));
      formData.append('vet_reference_name', vetReferenceName);
      formData.append('vet_reference_contact', vetReferenceContact);
      formData.append('has_children', String(hasChildren));
      formData.append('pet_care_experience', experience);
      formData.append('reason_for_adopting', reason);
      formData.append('long_term_care_acknowledgment', String(longTermConsent));
      formData.append('data_processing_consent', String(privacyConsent));
      formData.append('responsible_adoption_agreement', String(adoptionAgreement));

      if (idFile) formData.append('proof_of_id', idFile);
      if (addressFile) formData.append('proof_of_address', addressFile);
      if (incomeFile) formData.append('proof_of_income', incomeFile);
      if (housingFile) formData.append('proof_of_housing', housingFile);
      if (homeMediaFile) formData.append('home_environment_media', homeMediaFile);

      const res = await adoptionsApi.submit(formData);
      setSubmittedData({ reference_number: res.reference_number || 'APP-RECEIVED' });
    } catch (err: any) {
      const msg = err.response?.data
        ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : err.response.data)
        : 'Failed to submit application. Please check all fields.';
      setInquiryError(msg);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/pets" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to All Pets
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: IMAGES & BASIC DETAILS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#FCE4EC]/50 dark:bg-[#2A1A2A] aspect-4/3 border border-[#F1D5DF] dark:border-[#4D2E4D]">
            <img
              src={currentDisplayImg}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={STATUS_COLORS[pet.adoption_status] || 'bg-stone-100'}>
                {pet.adoption_status.toUpperCase()}
              </Badge>
            </div>
            {pet.shelter?.is_demo && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="pink">DEMO ANIMAL</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 cursor-pointer transition ${
                    currentDisplayImg === img.image_url ? 'border-[#F4435A] shadow-md scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Rescue Story / Personality */}
          <div className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-6 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#352633] dark:text-[#FCE4EC] uppercase tracking-wider mb-2">
                About {pet.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed whitespace-pre-line">
                {pet.description || 'No description provided.'}
              </p>
            </div>

            {pet.personality && (
              <div className="pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                <h4 className="text-xs font-bold text-[#F4435A] dark:text-[#F48FB1] uppercase tracking-wider mb-1">
                  Personality & Temperament
                </h4>
                <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed">{pet.personality}</p>
              </div>
            )}

            {pet.rescue_story && (
              <div className="pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                <h4 className="text-xs font-bold text-[#F4435A] dark:text-[#F48FB1] uppercase tracking-wider mb-1">
                  Rescue Backstory
                </h4>
                <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] leading-relaxed italic">{pet.rescue_story}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & PET VITALS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-6 shadow-xs">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">{pet.name}</h1>
                  <p className="text-xs text-[#786875] dark:text-[#C9B8C7] font-semibold">
                    {pet.breed || (pet.species === 'dog' ? 'Aspin' : 'Puspin')} • {formatAge(pet.age_years, pet.age_months)}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] hover:bg-[#FCE4EC] dark:hover:bg-[#382338] text-[#786875] dark:text-[#C9B8C7] cursor-pointer"
                  title="Share pet profile"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              {shareSuccess && (
                <p className="text-xs text-[#F4435A] dark:text-[#F48FB1] font-bold mt-2">Link copied to clipboard!</p>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-[#FCE4EC]/50 dark:bg-[#382338] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D]">
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Sex</span>
                <span className="font-bold text-[#352633] dark:text-[#FCE4EC] capitalize">{pet.sex}</span>
              </div>
              <div className="p-3 bg-[#FCE4EC]/50 dark:bg-[#382338] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D]">
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Size</span>
                <span className="font-bold text-[#352633] dark:text-[#FCE4EC] capitalize">{pet.size}</span>
              </div>
              <div className="p-3 bg-[#FCE4EC]/50 dark:bg-[#382338] rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D]">
                <span className="text-[#786875] dark:text-[#C9B8C7] text-[10px] uppercase font-bold block">Age Group</span>
                <span className="font-bold text-[#352633] dark:text-[#FCE4EC] capitalize">{pet.age_category}</span>
              </div>
            </div>

            {/* Health & Medical Status */}
            <div className="space-y-2 pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7]">Medical Vetting</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#352633] dark:text-[#FCE4EC]">
                  <CheckCircle className={`h-4 w-4 ${pet.is_vaccinated ? 'text-[#F4435A] dark:text-[#F48FB1]' : 'text-stone-300'}`} />
                  <span>Vaccinated</span>
                </div>
                <div className="flex items-center gap-2 text-[#352633] dark:text-[#FCE4EC]">
                  <CheckCircle className={`h-4 w-4 ${pet.is_sterilized ? 'text-[#F4435A] dark:text-[#F48FB1]' : 'text-stone-300'}`} />
                  <span>Spayed / Neutered</span>
                </div>
                <div className="flex items-center gap-2 text-[#352633] dark:text-[#FCE4EC]">
                  <CheckCircle className={`h-4 w-4 ${pet.is_dewormed ? 'text-[#F4435A] dark:text-[#F48FB1]' : 'text-stone-300'}`} />
                  <span>Dewormed</span>
                </div>
                <div className="flex items-center gap-2 text-[#352633] dark:text-[#FCE4EC]">
                  <CheckCircle className={`h-4 w-4 ${!pet.has_special_needs ? 'text-[#F4435A] dark:text-[#F48FB1]' : 'text-amber-500'}`} />
                  <span>{pet.has_special_needs ? 'Special Needs' : 'Healthy'}</span>
                </div>
              </div>
            </div>

            {/* Shelter info banner */}
            {pet.shelter && (
              <div className="p-4 rounded-2xl bg-[#FFEBF1]/60 dark:bg-[#382338]/60 border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF81AB] dark:text-[#F48FB1] block">
                  Holding Rescue Shelter
                </span>
                <Link to={`/shelters/${pet.shelter.slug}`} className="font-bold text-[#352633] dark:text-[#FCE4EC] hover:underline block text-sm">
                  {pet.shelter.name}
                </Link>
                <p className="text-[#786875] dark:text-[#C9B8C7] flex items-center gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1]" />
                  {pet.shelter.address || pet.city_detail?.name || 'Cebu'}
                </p>
              </div>
            )}

            {/* Application Trigger CTA */}
            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full font-bold shadow-lg"
                onClick={() => setInquiryModalOpen(true)}
                disabled={pet.adoption_status !== 'available'}
              >
                <Send className="h-4 w-4 mr-2" />
                {pet.adoption_status === 'available' ? `Apply to Adopt ${pet.name}` : `Currently ${pet.adoption_status}`}
              </Button>
              <p className="text-[11px] text-center text-[#786875] dark:text-[#C9B8C7]">
                Minimum 18+ legal age strictly required. Submissions undergo shelter screening.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADOPTION APPLICATION MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#2A1A2A] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <div className="flex items-center gap-2">
                <img
                  src="/images/sulfor-logo.jpeg"
                  alt="SurFur"
                  className="w-8 h-8 rounded-lg object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
                  }}
                />
                <div>
                  <h3 className="text-lg font-black text-[#352633] dark:text-[#FCE4EC]">Adoption Application: {pet.name}</h3>
                  <p className="text-[11px] text-[#786875] dark:text-[#C9B8C7]">Holding shelter: {pet.shelter_name || pet.shelter?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-1.5 rounded-lg text-[#786875] hover:text-[#352633] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submittedData ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#DDF5D5] text-[#224424] dark:bg-[#253826] dark:text-[#DDF5D5] flex items-center justify-center mx-auto text-2xl font-black">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-bold text-[#352633] dark:text-[#FCE4EC]">Application Submitted!</h4>
                <div className="inline-block p-3 px-6 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] border border-[#F1D5DF] dark:border-[#4D2E4D] font-mono text-sm font-bold text-[#F4435A] dark:text-[#F48FB1]">
                  Reference: {submittedData.reference_number}
                </div>
                <p className="text-xs text-[#786875] dark:text-[#C9B8C7] max-w-md mx-auto leading-relaxed">
                  Thank you for opening your heart to {pet.name}. Your application has been logged under status <strong>Submitted</strong> and routed to <strong>{pet.shelter_name || pet.shelter?.name}</strong>. The shelter team will review your credentials and contact you directly.
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Link to="/inquiries">
                    <Button size="sm">Track My Applications</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => { setInquiryModalOpen(false); setSubmittedData(null); }}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-5 text-xs">
                {inquiryError && <ErrorMessage message={inquiryError} />}

                {/* 1. APPLICANT DETAILS & 18+ REQUIREMENT */}
                <div className="space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                    1. Applicant Information & Age Verification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Date of Birth * (18+)</label>
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`w-full p-2.5 rounded-xl border ${
                          isUnderage ? 'border-red-500 ring-2 ring-red-400' : 'border-[#F1D5DF] dark:border-[#4D2E4D]'
                        } bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Contact Phone (PH) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0917 XXX XXXX"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Occupation / Source of Income</label>
                      <input
                        type="text"
                        placeholder="e.g. Graphic Designer, Freelancer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                      />
                    </div>
                  </div>

                  {/* Underage Alert Banner */}
                  {isUnderage && (
                    <div className="p-3 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-[#F4435A] mt-0.5" />
                      <div>
                        <strong className="block font-bold">Minimum Legal Age Requirement (18+)</strong>
                        <span>
                          Applicants must be at least 18 years old to adopt an animal under Philippine animal welfare regulations (Calculated age: {calculatedAge} years old). A parent or legal guardian must submit the application on your household's behalf.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. HOUSING TYPE & LIVING ENVIRONMENT */}
                <div className="space-y-3 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                  <h4 className="font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                    2. Housing & Living Situation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Housing Ownership *</label>
                      <div className="flex gap-4 p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/50 dark:bg-[#231423]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="housingType"
                            value="homeowner"
                            checked={housingType === 'homeowner'}
                            onChange={() => setHousingType('homeowner')}
                            className="text-[#F4435A] focus:ring-[#F48FB1]"
                          />
                          <span className="font-semibold text-[#352633] dark:text-[#FCE4EC]">Homeowner</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="housingType"
                            value="renter"
                            checked={housingType === 'renter'}
                            onChange={() => setHousingType('renter')}
                            className="text-[#F4435A] focus:ring-[#F48FB1]"
                          />
                          <span className="font-semibold text-[#352633] dark:text-[#FCE4EC]">Renter / Tenant</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Property Setup</label>
                      <select
                        value={livingSituation}
                        onChange={(e) => setLivingSituation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                      >
                        <option value="house_yard">House with fenced yard</option>
                        <option value="house_no_yard">House without yard</option>
                        <option value="apartment">Apartment / Condo (Pet-friendly)</option>
                        <option value="boarding">Boarding / Rented Room</option>
                        <option value="other">Other living space</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. DOCUMENT VERIFICATION UPLOADS */}
                <div className="space-y-3 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                  <h4 className="font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                    3. Screening Documents & Identity Verification
                  </h4>
                  <p className="text-[11px] text-[#786875] dark:text-[#C9B8C7]">
                    Shelters require identity verification to prevent animal hoarding or fraud under RA 10173.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ID */}
                    <div className="p-3 rounded-2xl border border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423]">
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                        Valid Government ID (Passport / PhilID / UMID / DL)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                        className="w-full text-[11px] text-[#786875] dark:text-[#C9B8C7] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-[#FCE4EC] dark:file:bg-[#382338] file:text-[#F4435A] dark:file:text-[#F48FB1]"
                      />
                    </div>

                    {/* Housing Proof */}
                    <div className="p-3 rounded-2xl border border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423]">
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                        {housingType === 'renter' ? 'Landlord Consent / Pet Addendum' : 'Proof of Homeownership / HOA Authority'}
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setHousingFile(e.target.files?.[0] || null)}
                        className="w-full text-[11px] text-[#786875] dark:text-[#C9B8C7] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-[#FCE4EC] dark:file:bg-[#382338] file:text-[#F4435A] dark:file:text-[#F48FB1]"
                      />
                    </div>

                    {/* Proof of Income */}
                    <div className="p-3 rounded-2xl border border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423]">
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                        Proof of Income / Financial Capacity (Payslip / COE)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setIncomeFile(e.target.files?.[0] || null)}
                        className="w-full text-[11px] text-[#786875] dark:text-[#C9B8C7] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-[#FCE4EC] dark:file:bg-[#382338] file:text-[#F4435A] dark:file:text-[#F48FB1]"
                      />
                    </div>

                    {/* Home environment media */}
                    <div className="p-3 rounded-2xl border border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423]">
                      <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                        Home Environment Photo or Walkthrough Video
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setHomeMediaFile(e.target.files?.[0] || null)}
                        className="w-full text-[11px] text-[#786875] dark:text-[#C9B8C7] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-[#FCE4EC] dark:file:bg-[#382338] file:text-[#F4435A] dark:file:text-[#F48FB1]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. PET EXPERIENCE & VET REFERENCE */}
                <div className="space-y-3 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
                  <h4 className="font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7] text-[11px]">
                    4. Pet Care Experience & Veterinary Reference
                  </h4>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#352633] dark:text-[#FCE4EC]">
                    <input
                      type="checkbox"
                      checked={hasOwnedPetsBefore}
                      onChange={(e) => setHasOwnedPetsBefore(e.target.checked)}
                      className="rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>I have owned pets before</span>
                  </label>

                  {hasOwnedPetsBefore && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FCE4EC]/50 dark:bg-[#231423] border border-[#F1D5DF] dark:border-[#4D2E4D]">
                      <div>
                        <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Veterinarian / Clinic Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Cebu Veterinary Clinic"
                          value={vetReferenceName}
                          onChange={(e) => setVetReferenceName(e.target.value)}
                          className="w-full p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#2A1A2A] text-[#352633] dark:text-[#FCE4EC]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Vet Clinic Contact Number</label>
                        <input
                          type="text"
                          placeholder="e.g. (032) 123 4567"
                          value={vetReferenceContact}
                          onChange={(e) => setVetReferenceContact(e.target.value)}
                          className="w-full p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#2A1A2A] text-[#352633] dark:text-[#FCE4EC]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Why do you want to adopt {pet.name}?</label>
                    <textarea
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tell the shelter a little about your lifestyle and why you're a good match..."
                      className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none text-xs"
                    />
                  </div>
                </div>

                {/* 5. LEGAL CONSENT & COVENANT */}
                <div className="space-y-2 pt-3 border-t border-[#F1D5DF] dark:border-[#4D2E4D] text-[11px] text-[#786875] dark:text-[#C9B8C7]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={longTermConsent}
                      onChange={(e) => setLongTermConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>
                      I understand that pet adoption is a 10-15+ year commitment including annual vet visits, nutrition, and emergency medical care.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={adoptionAgreement}
                      onChange={(e) => setAdoptionAgreement(e.target.checked)}
                      className="mt-0.5 rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>
                      I agree to the shelter's screening protocol and commit never to abandon, re-sell, or mistreat this companion.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#F4435A] focus:ring-[#F48FB1]"
                    />
                    <span>
                      I consent to SurFur processing my contact information and uploaded screening documents exclusively to coordinate this adoption with the holding shelter under RA 10173.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full font-bold"
                    isLoading={submittingInquiry}
                    disabled={isUnderage || !privacyConsent || !adoptionAgreement || !longTermConsent}
                  >
                    Submit Verified Adoption Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
