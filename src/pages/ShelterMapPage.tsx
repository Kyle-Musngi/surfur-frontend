import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sheltersApi } from '../api/shelters';
import { coreApi } from '../api/core';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, List, Map as MapIcon, X, Check, ArrowRight } from 'lucide-react';
import type { Shelter, CebuLocation } from '../types';
import { extractResults } from '../utils/apiHelpers';

// Fix Leaflet marker icons in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom markers based on species focus & selection state using SurFur palette
const createCustomIcon = (animalType: string, isSelected: boolean) => {
  const baseColor = animalType === 'dogs' ? '#F4435A' : animalType === 'cats' ? '#E94EAA' : '#F48FB1';
  const emoji = animalType === 'dogs' ? '🐶' : animalType === 'cats' ? '🐱' : '🐾';

  if (isSelected) {
    return L.divIcon({
      className: 'custom-map-marker-container',
      html: `
        <div class="custom-map-marker custom-map-marker-selected" style="filter: drop-shadow(0 4px 14px rgba(244,67,90,0.5));">
          <div class="marker-pin-inner" style="
            background: linear-gradient(135deg, #F4435A 0%, #C62845 100%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3.5px solid #FFFFFF;
            box-shadow: 0 0 0 3px #FFFFFF, 0 0 0 6px #F4435A, 0 8px 24px rgba(244, 67, 90, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            user-select: none;
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">${emoji}</div>
          <div class="marker-triangle-pointer" style="
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 8px solid #C62845;
            margin: -2px auto 0 auto;
          "></div>
        </div>
      `,
      iconSize: [44, 52],
      iconAnchor: [22, 52],
      popupAnchor: [0, -52],
    });
  }

  return L.divIcon({
    className: 'custom-map-marker-container',
    html: `
      <div class="custom-map-marker" style="filter: drop-shadow(0 2px 6px rgba(53,38,51,0.25));">
        <div class="marker-pin-inner" style="
          background-color: ${baseColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 3px 8px rgba(53, 38, 51, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        ">${emoji}</div>
        <div class="marker-triangle-pointer" style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${baseColor};
          margin: -1px auto 0 auto;
        "></div>
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38],
  });
};

const DEFAULT_CENTER: [number, number] = [10.3157, 123.8854];
const DEFAULT_ZOOM = 11;

// Map Controller for smooth synchronized panning & zooming
function MapController({
  selectedShelter,
  markerRefs,
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
}: {
  selectedShelter: Shelter | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}) {
  const map = useMap();
  const prevSelectedRef = useRef<Shelter | null>(null);

  useEffect(() => {
    if (selectedShelter && selectedShelter.latitude != null && selectedShelter.longitude != null) {
      const lat = Number(selectedShelter.latitude);
      const lng = Number(selectedShelter.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Smoothly pan & zoom to selected shelter location
        map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
          duration: 0.9,
        });

        // Open popup automatically for selected shelter after fly animation
        const timer = setTimeout(() => {
          const marker = markerRefs.current[selectedShelter.id];
          if (marker) {
            marker.openPopup();
          }
        }, 400);

        prevSelectedRef.current = selectedShelter;
        return () => clearTimeout(timer);
      }
    } else if (!selectedShelter && prevSelectedRef.current) {
      // User closed or cleared shelter selection: reset zoom and center to default overview
      map.closePopup();
      map.flyTo(defaultCenter, defaultZoom, {
        duration: 0.8,
      });
      prevSelectedRef.current = null;
    }
  }, [selectedShelter, map, markerRefs, defaultCenter, defaultZoom]);

  return null;
}

export function ShelterMapPage() {
  const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // References for bidirectional synchronization
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => coreApi.getLocations(),
  });

  const locations = extractResults<CebuLocation>(locationsData);

  const { data: sheltersData, isLoading } = useQuery({
    queryKey: ['shelters', { city: selectedCity, animal_types: selectedAnimalType, verifiedOnly }],
    queryFn: () =>
      sheltersApi.list({
        city: selectedCity,
        animal_types: (selectedAnimalType as any) || undefined,
        verification_status: verifiedOnly ? 'verified' : undefined,
      }),
  });

  const shelters = extractResults<Shelter>(sheltersData);

  // Filter shelters with valid coordinates for map markers
  const mappableShelters = shelters.filter(
    (s) => s.latitude != null && s.longitude != null && !isNaN(Number(s.latitude)) && !isNaN(Number(s.longitude))
  );

  // Shared shelter selection handler
  const handleSelectShelter = (shelter: Shelter | null, fromMap = false) => {
    setSelectedShelter(shelter);
    if (!shelter) return;

    // When clicked from map marker, smoothly scroll corresponding left card into view
    if (fromMap && cardRefs.current[shelter.id]) {
      cardRefs.current[shelter.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }

    // On mobile, if clicked from list view, switch to map view to display pin
    if (!fromMap && window.innerWidth < 768) {
      setMobileView('map');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        alert('Unable to retrieve your location. Check browser permissions.');
      }
    );
  };

  // Center on Cebu Province / Metro Cebu
  const defaultCenter: [number, number] = [10.3157, 123.8854];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#FFEBF1] dark:bg-[#1E121E] text-[#352633] dark:text-[#FCE4EC]">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-[#2A1A2A] border-b border-[#F1D5DF] dark:border-[#4D2E4D] p-4 shrink-0 shadow-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#352633] dark:text-[#FCE4EC] flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#F4435A] dark:text-[#F48FB1]" /> Cebu Locator
            </span>

            {/* City Filter */}
            <select
              value={selectedCity || ''}
              onChange={(e) => {
                setSelectedCity(e.target.value ? Number(e.target.value) : undefined);
                setSelectedShelter(null);
              }}
              className="p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#382338] text-[#352633] dark:text-[#FCE4EC] font-semibold"
            >
              <option value="">All Cebu Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* Animal Type Filter */}
            <select
              value={selectedAnimalType}
              onChange={(e) => {
                setSelectedAnimalType(e.target.value);
                setSelectedShelter(null);
              }}
              className="p-2 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FFEBF1]/50 dark:bg-[#382338] text-[#352633] dark:text-[#FCE4EC] font-semibold"
            >
              <option value="">All Animals</option>
              <option value="dogs">🐶 Dogs Only</option>
              <option value="cats">🐱 Cats Only</option>
              <option value="both">🐾 Dogs & Cats</option>
            </select>

            {/* Verified toggle */}
            <label className="flex items-center gap-1.5 font-bold cursor-pointer text-[#352633] dark:text-[#FCE4EC] pl-1">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setSelectedShelter(null);
                }}
                className="rounded accent-[#F4435A] focus:ring-[#F48FB1]"
              />
              <span>Verified Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleUseMyLocation} className="text-xs">
              <Navigation className="h-3.5 w-3.5 mr-1" /> Use My Location
            </Button>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] overflow-hidden">
              <button
                onClick={() => setMobileView('map')}
                className={`p-1.5 px-3 flex items-center gap-1 font-bold ${
                  mobileView === 'map' ? 'bg-[#F4435A] text-white' : 'bg-white dark:bg-[#2A1A2A] text-[#786875] dark:text-[#C9B8C7]'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Map
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={`p-1.5 px-3 flex items-center gap-1 font-bold ${
                  mobileView === 'list' ? 'bg-[#F4435A] text-white' : 'bg-white dark:bg-[#2A1A2A] text-[#786875] dark:text-[#C9B8C7]'
                }`}
              >
                <List className="h-3.5 w-3.5" /> List ({shelters.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR: SHELTER LIST */}
        <div
          className={`w-full md:w-96 bg-[#FFEBF1] dark:bg-[#1E121E] border-r border-[#F1D5DF] dark:border-[#4D2E4D] overflow-y-auto p-4 space-y-4 shrink-0 ${
            mobileView === 'map' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Sidebar Header with Counter & Clear Action */}
          <div className="flex items-center justify-between text-xs text-[#786875] dark:text-[#C9B8C7] pb-3 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[#352633] dark:text-[#FCE4EC]">{shelters.length} Shelters in Cebu</span>
              {selectedShelter && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1]">
                  1 Selected
                </span>
              )}
            </div>
            {selectedShelter && (
              <button
                onClick={() => handleSelectShelter(null)}
                className="text-[11px] font-bold text-[#F4435A] dark:text-[#F48FB1] hover:underline flex items-center gap-0.5 cursor-pointer"
                aria-label="Clear shelter selection"
              >
                <X className="w-3 h-3" /> Clear Selection
              </button>
            )}
          </div>

          {isLoading ? (
            <Spinner />
          ) : shelters.length > 0 ? (
            shelters.map((s) => {
              const isSelected = selectedShelter?.id === s.id;
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    cardRefs.current[s.id] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  aria-label={`Select shelter ${s.name} in ${s.city_detail?.name || 'Cebu'}`}
                  onClick={() => handleSelectShelter(isSelected ? null : s, false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectShelter(isSelected ? null : s, false);
                    }
                  }}
                  className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer outline-none relative ${
                    isSelected
                      ? 'border-2 border-[#FF81AB] dark:border-[#F48FB1] bg-[#FFEBF1] dark:bg-[#382338] shadow-md shadow-[#FF81AB]/15 ring-2 ring-[#FF81AB]/30 dark:ring-[#F48FB1]/30 translate-x-1'
                      : 'border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#2A1A2A] hover:border-[#FF81AB] dark:hover:border-[#F48FB1] hover:bg-[#FFEBF1]/50 dark:hover:bg-[#382338]/40 hover:shadow-xs'
                  } focus-visible:ring-2 focus-visible:ring-[#FF81AB]`}
                >
                  <div className="flex items-start gap-3">
                    {/* Shelter Thumbnail */}
                    <div className="relative shrink-0">
                      <img
                        src={s.profile_image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&h=120&fit=crop&q=80'}
                        alt={s.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#F1D5DF] dark:border-[#4D2E4D]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&h=120&fit=crop&q=80';
                        }}
                      />
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#F4435A] border-2 border-white dark:border-[#2A1A2A] flex items-center justify-center text-[9px] text-white font-bold">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Shelter Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-[#352633] dark:text-[#FCE4EC] leading-snug break-words">
                          {s.name}
                        </h4>
                        {isSelected && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#F4435A] text-white shadow-xs">
                              Selected
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectShelter(null);
                              }}
                              className="p-1 rounded-full text-[#786875] hover:text-[#F4435A] hover:bg-white/80 dark:hover:bg-[#1E121E] transition-colors cursor-pointer"
                              title="Deselect shelter"
                              aria-label="Deselect shelter"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#786875] dark:text-[#C9B8C7] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#FF81AB] dark:text-[#F48FB1] shrink-0" />
                        <span className="truncate">{s.city_detail?.name || 'Cebu City'}, Cebu</span>
                      </p>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFEBF1] text-[#C62845] border border-[#F1D5DF] dark:bg-[#223323] dark:text-[#74C69D] dark:border-transparent">
                          {s.available_pets_count} adoptable {s.available_pets_count === 1 ? 'pet' : 'pets'}
                        </span>

                        {s.verification_status === 'verified' && (
                          <Badge variant="mint" className="text-[10px]">Verified</Badge>
                        )}

                        {s.is_demo && (
                          <Badge variant="pink" className="text-[10px]">Demo</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Footer on selected card */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-[#FF81AB]/40 dark:border-[#4D2E4D] flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-[#FF81AB] dark:text-[#F48FB1] flex items-center gap-1">
                        <Navigation className="h-3 w-3" /> Centered on Map
                      </span>
                      <a
                        href={`/shelters/${s.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-[11px] text-[#352633] dark:text-[#FCE4EC] hover:text-[#FF81AB] dark:hover:text-[#F48FB1] underline inline-flex items-center gap-0.5"
                      >
                        View Shelter <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[#786875] dark:text-[#C9B8C7] text-xs">
              No shelters found matching criteria in Cebu.
            </div>
          )}
        </div>

        {/* MAP CONTAINER */}
        <div className={`flex-1 h-full relative ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
          <MapContainer
            center={userLocation || defaultCenter}
            zoom={11}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Synchronized Pan & Zoom Controller */}
            <MapController selectedShelter={selectedShelter} markerRefs={markerRefs} />

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>You are approximately here</Popup>
              </Marker>
            )}

            {/* Shelter Markers */}
            {mappableShelters.map((s) => {
              const isSelected = selectedShelter?.id === s.id;
              return (
                <Marker
                  key={s.id}
                  ref={(el) => {
                    markerRefs.current[s.id] = el;
                  }}
                  position={[Number(s.latitude), Number(s.longitude)]}
                  icon={createCustomIcon(s.animal_types, isSelected)}
                  zIndexOffset={isSelected ? 1000 : 0}
                  eventHandlers={{
                    click: () => handleSelectShelter(s, true),
                  }}
                >
                  <Popup className="custom-shelter-popup" minWidth={260} maxWidth={320}>
                    <div className="p-1 space-y-2.5 text-xs">
                      {/* Header */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-black text-[#352633] dark:text-[#FCE4EC] text-sm leading-snug">
                            {s.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          {s.verification_status === 'verified' && (
                            <Badge variant="mint" className="text-[9px]">Verified Shelter</Badge>
                          )}
                          {s.is_demo && (
                            <Badge variant="pink" className="text-[9px]">Demo Organization</Badge>
                          )}
                          <span className="text-[10px] font-semibold text-[#786875] dark:text-[#C9B8C7]">
                            {s.animal_types === 'dogs' ? '🐶 Dogs only' : s.animal_types === 'cats' ? '🐱 Cats only' : '🐾 Dogs & Cats'}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {s.description && (
                        <p className="text-[#786875] dark:text-[#C9B8C7] line-clamp-2 text-[11px] leading-relaxed">
                          {s.description}
                        </p>
                      )}

                      {/* Location / Address */}
                      <div className="text-[11px] text-[#786875] dark:text-[#C9B8C7] flex items-start gap-1 leading-snug">
                        <MapPin className="h-3.5 w-3.5 text-[#FF81AB] dark:text-[#F48FB1] shrink-0 mt-0.5" />
                        <span>{s.address || `${s.city_detail?.name || 'Cebu City'}, Cebu`}</span>
                      </div>

                      {/* Pets Count */}
                      <div className="text-[11px] text-[#786875] dark:text-[#C9B8C7] font-semibold">
                        🐾 {s.available_pets_count} adoptable {s.available_pets_count === 1 ? 'companion' : 'companions'} listed
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D] flex justify-between items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF81AB] dark:text-[#F48FB1] font-bold text-xs hover:underline inline-flex items-center gap-1"
                        >
                          <Navigation className="h-3 w-3" /> Get Directions
                        </a>
                        <a
                          href={`/shelters/${s.slug}`}
                          className="bg-[#D4FFC6] hover:bg-[#bdf8ab] text-[#352633] border border-[#bce8ad] dark:bg-[#F4435A] dark:hover:bg-[#C62845] dark:text-white dark:border-transparent px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
                        >
                          View Shelter
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Mobile Notification Pill for Selected Shelter */}
          {selectedShelter && mobileView === 'map' && (
            <div className="md:hidden absolute bottom-4 left-4 right-4 z-[500] p-3 rounded-2xl bg-white dark:bg-[#2A1A2A] border-2 border-[#F4435A] dark:border-[#F48FB1] shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    selectedShelter.profile_image ||
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop&q=80'
                  }
                  alt={selectedShelter.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#F1D5DF] dark:border-[#4D2E4D]"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#352633] dark:text-[#FCE4EC] truncate">{selectedShelter.name}</h4>
                  <p className="text-[10px] text-[#786875] dark:text-[#C9B8C7] truncate">
                    📍 {selectedShelter.city_detail?.name || 'Cebu'}, Cebu • {selectedShelter.available_pets_count} pets
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setMobileView('list')}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#FFEBF1] dark:bg-[#382338] text-[#FF81AB] dark:text-[#F48FB1]"
                >
                  Details
                </button>
                <button
                  onClick={() => handleSelectShelter(null)}
                  className="p-1 rounded-lg text-[#786875] hover:text-[#F4435A]"
                  aria-label="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

