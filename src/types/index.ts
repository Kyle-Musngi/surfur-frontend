export type UserRole = 'adopter' | 'shelter_admin' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_photo: string;
  phone_number: string;
  city: string;
  email_notifications: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export type Species = 'dog' | 'cat' | 'other';
export type Sex = 'male' | 'female' | 'unknown';
export type Size = 'small' | 'medium' | 'large' | 'unknown';
export type AgeCategory = 'baby' | 'young' | 'adult' | 'senior' | 'unknown';
export type AdoptionStatus = 'available' | 'pending' | 'adopted' | 'hold' | 'unavailable';
export type AnimalType = 'dogs' | 'cats' | 'both' | 'other';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended';

export interface PetImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: Sex;
  size: Size;
  color: string;
  age_years: number | null;
  age_months: number | null;
  age_category: AgeCategory;
  description: string;
  personality: string;
  rescue_story: string;
  is_vaccinated: boolean | null;
  is_dewormed: boolean | null;
  is_sterilized: boolean | null;
  has_special_needs: boolean;
  special_needs_description: string;
  health_notes: string;
  good_with_children: boolean | null;
  good_with_dogs: boolean | null;
  good_with_cats: boolean | null;
  adoption_status: AdoptionStatus;
  shelter_name?: string;
  shelter_slug?: string;
  city_name?: string;
  primary_image?: PetImage | null;
  images?: PetImage[];
  shelter?: Shelter;
  city_detail?: CebuLocation;
  is_published?: boolean;
  is_favorited?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CebuLocation {
  id: number;
  name: string;
  location_type: 'city' | 'municipality';
  province: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Shelter {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
  description: string;
  mission?: string;
  address?: string;
  city?: number;
  city_detail?: CebuLocation;
  latitude: number;
  longitude: number;
  phone_number: string;
  email: string;
  website: string;
  facebook_url: string;
  instagram_url?: string;
  profile_image: string;
  cover_image: string;
  animal_types: AnimalType;
  operating_hours?: Record<string, string>;
  adoption_requirements?: string;
  verification_status: VerificationStatus;
  is_demo: boolean;
  available_pets_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InquiryStatusHistoryItem {
  id?: number;
  old_status: string;
  new_status: string;
  notes: string;
  changed_by_name?: string;
  timestamp: string;
}

export interface AdoptionInquiry {
  id: string;
  reference_number: string;
  pet_name: string;
  pet_species?: Species;
  shelter_name: string;
  shelter_slug?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  applicant_city?: string;
  date_of_birth?: string;
  occupation?: string;
  contact_preference?: string;
  housing_type?: 'homeowner' | 'renter' | 'other';
  living_situation?: string;
  proof_of_id?: string | null;
  proof_of_address?: string | null;
  proof_of_income?: string | null;
  proof_of_housing?: string | null;
  home_environment_media?: string | null;
  has_existing_pets?: boolean;
  existing_pets_description?: string;
  has_owned_pets_before?: boolean;
  vet_reference_name?: string;
  vet_reference_contact?: string;
  has_children?: boolean;
  pet_care_experience?: string;
  reason_for_adopting?: string;
  long_term_care_acknowledgment?: boolean;
  shelter_notes?: string;
  reviewer_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
  status_history?: InquiryStatusHistoryItem[];
  pet?: Pet;
}

export interface StrayReport {
  id: string;
  report_number: string;
  animal_type: string;
  animal_description: string;
  location_description: string;
  urgency: string;
  status: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_datetime: string;
  end_datetime?: string;
  venue_name: string;
  venue_address: string;
  city?: CebuLocation;
  contact_info: string;
  registration_required: boolean;
  registration_link: string;
  cover_photo: string;
  status: string;
  host_shelter_name?: string;
}

export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  related_resource_type: string;
  related_resource_id: string;
  is_read: boolean;
  created_at: string;
}

export type PetFilters = {
  species?: Species;
  sex?: Sex;
  size?: Size;
  age_category?: AgeCategory;
  city?: number;
  is_vaccinated?: boolean;
  is_sterilized?: boolean;
  has_special_needs?: boolean;
  verified_shelter_only?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  adoption_status?: string;
};

export type ShelterFilters = {
  animal_types?: AnimalType;
  verification_status?: VerificationStatus;
  city?: number;
  search?: string;
  ordering?: string;
};
