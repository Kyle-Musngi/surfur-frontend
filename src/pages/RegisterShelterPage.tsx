import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sheltersApi } from '../api/shelters';
import { coreApi } from '../api/core';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { Building2, CheckCircle2, ArrowLeft, ShieldCheck, MapPin, Globe, FileText, Image, Upload, X } from 'lucide-react';
import type { CebuLocation } from '../types';
import { extractResults } from '../utils/apiHelpers';

export function RegisterShelterPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Organization details
  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState('shelter');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [contactPerson, setContactPerson] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');

  // Location details
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState<number | undefined>(undefined);
  const [province, setProvince] = useState('Cebu');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('10.3157');
  const [longitude, setLongitude] = useState('123.8854');

  // Supporting information
  const [website, setWebsite] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [animalTypes, setAnimalTypes] = useState('both');
  const [adoptionRequirements, setAdoptionRequirements] = useState('');
  const [verificationDocumentUrl, setVerificationDocumentUrl] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Branding Image Uploads
  const [profileImage, setProfileImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [profileFileName, setProfileFileName] = useState<string>('');
  const [coverFileName, setCoverFileName] = useState<string>('');

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (val: string) => void,
    setFileName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/i)) {
        setError('Please upload a standard image file (PNG, JPG, or JPEG).');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Legal confirmations
  const [confirmationAccurate, setConfirmationAccurate] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => coreApi.getLocations(),
  });

  const locations = extractResults<CebuLocation>(locationsData);

  const handleCityChange = (newCityId: number) => {
    setCityId(newCityId);
    const matchedLoc = locations.find((l) => l.id === newCityId);
    if (matchedLoc && matchedLoc.latitude && matchedLoc.longitude) {
      setLatitude(String(matchedLoc.latitude));
      setLongitude(String(matchedLoc.longitude));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center mx-auto shadow-xs">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-[#352633] dark:text-[#FCE4EC]">Sign In Required</h2>
        <p className="text-xs text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
          You must have a verified SurFur account before registering an animal shelter or rescue organization so we can link administrative ownership.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate('/login', { state: { from: '/shelters/register' } })}
            className="w-full sm:w-auto font-bold bg-[#F4435A] hover:bg-[#C62845] text-white"
          >
            Log In to Continue
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/register', { state: { from: '/shelters/register' } })}
            className="w-full sm:w-auto font-bold"
          >
            Create an Account
          </Button>
        </div>
        <div className="pt-4">
          <Link to="/shelters" className="text-xs text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shelters Directory
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cityId) {
      setError('Please select a Cebu municipality or city.');
      return;
    }
    if (!confirmationAccurate) {
      setError('You must confirm that all submitted organization details are accurate.');
      return;
    }
    if (!privacyConsent) {
      setError('You must consent to the platform privacy policy to proceed.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await sheltersApi.register({
        name: name.trim(),
        organization_type: orgType,
        description: description.trim(),
        mission: mission.trim(),
        contact_person: contactPerson.trim(),
        phone_number: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: cityId,
        province: province.trim() || 'Cebu',
        postal_code: postalCode.trim(),
        latitude: Number(latitude) || 10.3157,
        longitude: Number(longitude) || 123.8854,
        website: website.trim(),
        facebook_url: facebookUrl.trim(),
        profile_image: profileImage,
        cover_image: coverImage,
        animal_types: animalTypes as any,
        adoption_requirements: adoptionRequirements.trim(),
        verification_document_url: verificationDocumentUrl.trim(),
        verification_notes: verificationNotes.trim(),
        confirmation_accurate: confirmationAccurate,
        privacy_consent: privacyConsent,
      });

      setSuccessData(result);
    } catch (err: any) {
      let message = 'Failed to register shelter. Please check your inputs.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([field, errList]) => `${field}: ${Array.isArray(errList) ? errList.join(' ') : String(errList)}`)
            .join(' | ');
          message = errors || message;
        }
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Shelters Link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/shelters"
          className="text-xs font-bold text-[#786875] dark:text-[#C9B8C7] hover:text-[#F4435A] dark:hover:text-[#F48FB1] inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shelters Directory
        </Link>
        <span className="text-xs text-[#786875] dark:text-[#C9B8C7] font-medium">
          SurFur Rescue Network
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] text-xs font-bold border border-[#F1D5DF] dark:border-[#4D2E4D]">
          <Building2 className="h-3.5 w-3.5" /> Shelter Onboarding & Verification
        </div>
        <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Register Your Animal Shelter or Rescue Group
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] max-w-xl mx-auto">
          Connect your organization to the SurFur platform to manage adoptable pet listings, review adoption applications, and coordinate community rescues.
        </p>
      </div>

      {successData ? (
        <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center space-y-5 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#DDF5D5] text-[#224424] dark:bg-[#253826] dark:text-[#DDF5D5] flex items-center justify-center mx-auto text-2xl font-black">
            <CheckCircle2 className="h-8 w-8 text-[#224424] dark:text-[#DDF5D5]" />
          </div>
          <h2 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">
            Registration Submitted!
          </h2>
          <div className="p-4 rounded-2xl bg-[#FCE4EC]/50 dark:bg-[#382338]/60 border border-[#F1D5DF] dark:border-[#4D2E4D] text-left max-w-md mx-auto space-y-2 text-xs">
            <p className="font-bold text-[#352633] dark:text-[#FCE4EC]">
              Status: <span className="text-[#F4435A] dark:text-[#F48FB1]">Pending Review</span>
            </p>
            <p className="text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
              <strong>{successData.name || name}</strong> has been created. A SurFur platform administrator will verify your organization credentials. You can now access your shelter administrator dashboard to prepare adoptable listings.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="md"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto font-bold bg-[#F4435A] hover:bg-[#C62845] text-white shadow-md shadow-[#F4435A]/20"
            >
              Go to Shelter Dashboard
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => navigate('/shelters')}
              className="w-full sm:w-auto font-bold"
            >
              Return to Shelters Directory
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-sm space-y-7 text-xs">
          {error && <ErrorMessage message={error} />}

          {/* 1. Organization Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <Building2 className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#352633] dark:text-[#FCE4EC]">
                1. Organization Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Official Shelter / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mandaue Animal Care Sanctuary"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Organization Type *
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold outline-none"
                >
                  <option value="shelter">Registered Animal Shelter</option>
                  <option value="rescue_org">Rescue Organization / NGO</option>
                  <option value="pound">City / Municipal Pound</option>
                  <option value="foster_network">Community Foster Network</option>
                  <option value="other">Other Animal Welfare Group</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Description of Activities & Rescue Work *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your facility, current rescue capacity, animal rescue operations, and history in Cebu..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Mission Statement (Optional)
              </label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Our mission is to give every rescued companion a loving forever home..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Contact Person Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shelter@domain.com"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0917 XXX XXXX"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Location Details */}
          <div className="space-y-4 pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex items-center gap-2 pb-1 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <MapPin className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#352633] dark:text-[#FCE4EC]">
                2. Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Municipality / City *
                </label>
                <select
                  required
                  value={cityId || ''}
                  onChange={(e) => handleCityChange(Number(e.target.value))}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none font-semibold"
                >
                  <option value="">Select Municipality...</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.location_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Province
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 6000"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Complete Facility / Visiting Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building / Compound, Street, Barangay, Landmark"
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Map Latitude
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Map Longitude
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Supporting Information */}
          <div className="space-y-4 pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex items-center gap-2 pb-1 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <Globe className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#352633] dark:text-[#FCE4EC]">
                3. Supporting Information & Online Presence
              </h3>
            </div>

            {/* Branding Images: Profile Picture and Cover Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E121E] border border-[#F1D5DF] dark:border-[#4D2E4D]">
              {/* Profile Picture */}
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Profile Picture / Logo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {profileImage ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#F1D5DF] dark:border-[#4D2E4D] shrink-0 bg-stone-100 dark:bg-stone-800">
                      <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage('');
                          setProfileFileName('');
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full hover:bg-black"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] flex items-center justify-center shrink-0 text-[#786875] dark:text-[#C9B8C7]">
                      <Image className="w-6 h-6 opacity-60" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleImageFileChange(e, setProfileImage, setProfileFileName)}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FFEBF1] hover:bg-[#ffd6e4] text-[#F4435A] border border-[#F1D5DF] dark:bg-[#382338] dark:hover:bg-[#482c48] dark:text-[#FCE4EC] dark:border-[#4D2E4D] cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {profileFileName ? 'Change Logo' : 'Choose Logo'}
                    </label>
                    <p className="text-[10px] text-[#786875] dark:text-[#C9B8C7] mt-1 truncate">
                      {profileFileName || 'PNG, JPG or JPEG (avatar)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Cover Photo / Banner (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {coverImage ? (
                    <div className="relative w-20 h-14 rounded-2xl overflow-hidden border border-[#F1D5DF] dark:border-[#4D2E4D] shrink-0 bg-stone-100 dark:bg-stone-800">
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage('');
                          setCoverFileName('');
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full hover:bg-black"
                        title="Remove cover"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-14 rounded-2xl border-2 border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] flex items-center justify-center shrink-0 text-[#786875] dark:text-[#C9B8C7]">
                      <Image className="w-6 h-6 opacity-60" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="cover-upload"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleImageFileChange(e, setCoverImage, setCoverFileName)}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FFEBF1] hover:bg-[#ffd6e4] text-[#F4435A] border border-[#F1D5DF] dark:bg-[#382338] dark:hover:bg-[#482c48] dark:text-[#FCE4EC] dark:border-[#4D2E4D] cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {coverFileName ? 'Change Banner' : 'Choose Banner'}
                    </label>
                    <p className="text-[10px] text-[#786875] dark:text-[#C9B8C7] mt-1 truncate">
                      {coverFileName || 'PNG, JPG or JPEG (shelter banner)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourshelter.org"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/shelter"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                  Animal Focus
                </label>
                <select
                  value={animalTypes}
                  onChange={(e) => setAnimalTypes(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none font-semibold"
                >
                  <option value="both">🐶🐱 Dogs & Cats</option>
                  <option value="dogs">🐶 Dogs Only</option>
                  <option value="cats">🐱 Cats Only</option>
                  <option value="other">🐾 Other Animals</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Adoption Screening Requirements
              </label>
              <textarea
                rows={2}
                value={adoptionRequirements}
                onChange={(e) => setAdoptionRequirements(e.target.value)}
                placeholder="e.g. Government-issued photo ID, proof of income, virtual home check, signing adoption covenant..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Supporting Registration Documents / Cloud Link (Optional)
              </label>
              <input
                type="url"
                value={verificationDocumentUrl}
                onChange={(e) => setVerificationDocumentUrl(e.target.value)}
                placeholder="e.g. SEC registration, LGU permit, or cloud link to credentials"
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
              />
              <span className="text-[10px] text-[#786875] dark:text-[#C9B8C7] mt-0.5 block">
                Sensitive documents are only accessible to authorized SurFur platform administrators during review.
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">
                Additional Verification Notes
              </label>
              <textarea
                rows={2}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="e.g. Registered with SEC under registration #XXXX, or operated in partnership with city veterinarian..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              />
            </div>
          </div>

          {/* 4. Confirmations & Consent */}
          <div className="space-y-3 pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex items-center gap-2 pb-1 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
              <ShieldCheck className="w-4 h-4 text-[#F4435A] dark:text-[#F48FB1]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#352633] dark:text-[#FCE4EC]">
                4. Declarations & Privacy Consent
              </h3>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-[#352633] dark:text-[#FCE4EC] font-medium leading-relaxed">
              <input
                type="checkbox"
                required
                checked={confirmationAccurate}
                onChange={(e) => setConfirmationAccurate(e.target.checked)}
                className="mt-0.5 rounded accent-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>
                I confirm that I am an authorized representative of this animal welfare organization and all submitted details are true and accurate. *
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-[#352633] dark:text-[#FCE4EC] font-medium leading-relaxed">
              <input
                type="checkbox"
                required
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-0.5 rounded accent-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>
                I consent to the collection and verification of this information in compliance with the Philippine Data Privacy Act of 2012 (RA 10173). *
              </span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-bold bg-[#F4435A] hover:bg-[#C62845] active:bg-[#a81f37] text-white shadow-md shadow-[#F4435A]/20 transition-all border-0 py-3 text-sm cursor-pointer"
            isLoading={submitting}
          >
            Submit Shelter Registration for Review
          </Button>
        </form>
      )}
    </div>
  );
}
