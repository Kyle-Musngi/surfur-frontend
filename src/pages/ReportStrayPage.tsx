import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';
import { coreApi } from '../api/core';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle2, Image, Upload, X } from 'lucide-react';
import type { CebuLocation } from '../types';
import { extractResults } from '../utils/apiHelpers';

export function ReportStrayPage() {
  const { user } = useAuth();
  const [animalType, setAnimalType] = useState('dog');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [cityId, setCityId] = useState<number | undefined>(undefined);
  const [locationDesc, setLocationDesc] = useState('');
  const [reporterName, setReporterName] = useState(user?.full_name || '');
  const [reporterEmail, setReporterEmail] = useState(user?.email || '');
  const [reporterPhone, setReporterPhone] = useState(user?.phone_number || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [consent, setConsent] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/i)) {
        setError('Please upload a standard image file (PNG, JPG, or JPEG).');
        return;
      }
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => coreApi.getLocations(),
  });

  const locations = extractResults<CebuLocation>(locationsData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please acknowledge the privacy & responsible reporting consent.');
      return;
    }

    setSubmitting(true);
    try {
      const data: Record<string, any> = {
        animal_type: animalType,
        animal_description: description,
        animal_condition: condition,
        urgency,
        city: cityId,
        location_description: locationDesc,
        sighted_at: new Date().toISOString(),
        reporter_name: reporterName,
        reporter_email: reporterEmail,
        reporter_phone: reporterPhone,
        image_urls: photoPreview ? [photoPreview] : (photoUrl ? [photoUrl] : []),
        data_processing_consent: true,
      };

      const res = await reportsApi.submit(data);
      setSubmittedReport(res);
    } catch (err: any) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] text-xs font-bold border border-[#F1D5DF] dark:border-[#4D2E4D]">
          <AlertTriangle className="h-3.5 w-3.5" /> Community Welfare Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">
          Report a Stray or Injured Animal in Cebu
        </h1>
        <p className="text-xs sm:text-sm text-[#786875] dark:text-[#C9B8C7] max-w-xl mx-auto leading-relaxed">
          Alert local animal rescue networks and pounds across Cebu. Exact coordinates and reporter contact information are kept strictly protected.
        </p>
      </div>

      <div className="bg-[#FCE4EC] dark:bg-[#2A1A2A] p-5 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-xs text-[#352633] dark:text-[#FCE4EC] flex items-start gap-3 shadow-xs">
        <AlertTriangle className="h-5 w-5 text-[#F4435A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#F4435A] dark:text-[#F48FB1]">Life-Threatening Emergency Notice:</span>
          <p className="text-[11px] mt-0.5 text-[#786875] dark:text-[#C9B8C7] leading-relaxed">
            If an animal has suffered severe trauma (e.g. hit-and-run) or is in acute agony, please also contact the nearest 24/7 veterinary clinic or local City Veterinary Office immediately.
          </p>
        </div>
      </div>

      {submittedReport ? (
        <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#DDF5D5] text-[#224424] dark:bg-[#253826] dark:text-[#DDF5D5] flex items-center justify-center mx-auto text-2xl font-black">
            <CheckCircle2 className="h-8 w-8 text-[#224424] dark:text-[#DDF5D5]" />
          </div>
          <h2 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">Report Lodged Successfully</h2>
          <div className="inline-block p-3 px-5 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] border border-[#F1D5DF] dark:border-[#4D2E4D] font-mono text-sm font-bold text-[#F4435A] dark:text-[#F48FB1]">
            Reference: {submittedReport.report_number}
          </div>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] max-w-md mx-auto leading-relaxed">
            Your report has been logged in the SurFur community dispatch. Authorized rescue organizations and coordinators in {locations.find(l => l.id === cityId)?.name || 'the area'} will review the submission.
          </p>
          <div className="pt-4">
            <Button onClick={() => setSubmittedReport(null)} size="sm">
              Submit Another Report
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-sm space-y-6 text-xs">
          {error && <ErrorMessage message={error} />}

          {/* Animal details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7]">1. Animal Information</h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'dog', label: '🐶 Stray Dog' },
                { val: 'cat', label: '🐱 Stray Cat' },
                { val: 'other', label: '🐾 Other' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setAnimalType(opt.val)}
                  className={`p-3 rounded-2xl font-bold border transition-all cursor-pointer ${
                    animalType === opt.val
                      ? 'bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] border-[#F4435A] dark:border-[#F48FB1]'
                      : 'border-[#F1D5DF] dark:border-[#4D2E4D] text-[#786875] dark:text-[#C9B8C7] hover:border-[#F48FB1]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Physical Description *</label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Color, markings, collar/tags, approximate size..."
                className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Health Condition / Injuries</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. Limping, malnourished, skin mange"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Urgency Priority *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold outline-none"
                >
                  <option value="low">Low - Wandering / Observation</option>
                  <option value="medium">Medium - Stray, Appears Healthy</option>
                  <option value="high">High - Prompt Intervention Needed</option>
                  <option value="critical">Critical - Immediate Medical Risk</option>
                </select>
              </div>
            </div>

            {/* Optional Stray Photo Upload */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E121E] border border-[#F1D5DF] dark:border-[#4D2E4D] space-y-3">
              <label className="block font-bold text-[#352633] dark:text-[#FCE4EC]">
                Upload a Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                {photoPreview ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#F1D5DF] dark:border-[#4D2E4D] shrink-0 bg-stone-100 dark:bg-stone-800">
                    <img src={photoPreview} alt="Stray preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setPhotoFileName('');
                      }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full hover:bg-black"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#F1D5DF] dark:border-[#4D2E4D] flex items-center justify-center shrink-0 text-[#786875] dark:text-[#C9B8C7]">
                    <Image className="w-6 h-6 opacity-60" />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    id="stray-photo-upload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="stray-photo-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FFEBF1] hover:bg-[#ffd6e4] text-[#F4435A] border border-[#F1D5DF] dark:bg-[#382338] dark:hover:bg-[#482c48] dark:text-[#FCE4EC] dark:border-[#4D2E4D] cursor-pointer transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {photoFileName ? 'Change Photo' : 'Choose Photo File'}
                  </label>
                  <p className="text-[10px] text-[#786875] dark:text-[#C9B8C7] mt-1 truncate">
                    {photoFileName || 'Accepts PNG, JPG or JPEG. Helps rescuers identify the animal.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]/50">
                <span className="text-[11px] font-semibold text-[#786875] dark:text-[#C9B8C7] block mb-1">
                  Or provide an external Image URL:
                </span>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://... (Public photo link or hosted image)"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4 pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7]">2. Location Sighted</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Cebu Municipality / City *</label>
                <select
                  required
                  value={cityId || ''}
                  onChange={(e) => setCityId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] font-semibold outline-none"
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
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Landmark / Approximate Street *</label>
                <input
                  type="text"
                  required
                  value={locationDesc}
                  onChange={(e) => setLocationDesc(e.target.value)}
                  placeholder="e.g. Near Banilad flyover, behind 7-Eleven"
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Reporter info */}
          <div className="space-y-4 pt-4 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#786875] dark:text-[#C9B8C7]">3. Reporter Details (Confidential)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Phone</label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Email</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D] space-y-2">
            <label className="flex items-start gap-2 cursor-pointer text-[#786875] dark:text-[#C9B8C7]">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>
                I confirm this report is truthful and accurate to the best of my knowledge. I understand SurFur coordinates dispatch with volunteers and cannot guarantee automatic rescue of all reported strays.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-bold"
            isLoading={submitting}
            disabled={!consent}
          >
            Submit Community Stray Report
          </Button>
        </form>
      )}
    </div>
  );
}
