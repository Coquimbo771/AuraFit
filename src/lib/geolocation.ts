
export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface NearbyStore {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  phone: string;
  hours: string;
  hasStock: boolean;
  coordinates: { lat: number; lng: number };
}

/**
 * Get user's current geolocation
 */
export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get city/country (using OpenStreetMap Nominatim - free API)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          resolve({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village,
            country: data.address?.country,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        } catch (error) {
          // Fallback without city/country info
          resolve({
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find nearby stores (mock data - in production, query from database)
 */
export const findNearbyStores = async (
  userLocation: UserLocation,
  maxDistance: number = 50
): Promise<NearbyStore[]> => {
  // Mock store data - in production, this would be a database query
  const allStores: Omit<NearbyStore, 'distance'>[] = [
    {
      id: 'store-1',
      name: 'AuraFit Centro',
      address: 'Av. Principal 123, Centro',
      phone: '+1 234 567 8900',
      hours: 'Lun-Sab: 10:00-20:00, Dom: 11:00-18:00',
      hasStock: true,
      coordinates: { lat: userLocation.latitude + 0.01, lng: userLocation.longitude + 0.01 },
    },
    {
      id: 'store-2',
      name: 'AuraFit Plaza Norte',
      address: 'Boulevard Norte 456, Plaza Norte',
      phone: '+1 234 567 8901',
      hours: 'Lun-Dom: 10:00-22:00',
      hasStock: true,
      coordinates: { lat: userLocation.latitude - 0.02, lng: userLocation.longitude + 0.03 },
    },
    {
      id: 'store-3',
      name: 'AuraFit Mall Sur',
      address: 'Calle Comercio 789, Mall Sur',
      phone: '+1 234 567 8902',
      hours: 'Lun-Dom: 11:00-21:00',
      hasStock: false,
      coordinates: { lat: userLocation.latitude + 0.03, lng: userLocation.longitude - 0.02 },
    },
  ];

  // Calculate distance for each store
  const storesWithDistance = allStores.map((store) => ({
    ...store,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      store.coordinates.lat,
      store.coordinates.lng
    ),
  }));

  // Filter by max distance and sort by nearest
  return storesWithDistance
    .filter((store) => store.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Get localized content based on user's location
 */
export const getLocalizedContent = (location: UserLocation) => {
  const { city, country, timezone } = location;

  // Time-based greetings
  const hour = new Date().getHours();
  let greeting = 'Hola';
  if (hour < 12) greeting = 'Buenos días';
  else if (hour < 20) greeting = 'Buenas tardes';
  else greeting = 'Buenas noches';

  // Location-based messaging
  let locationMessage = '';
  if (city) {
    locationMessage = `Envío gratis en ${city}`;
  } else if (country) {
    locationMessage = `Disponible en ${country}`;
  }

  // Currency based on country (simplified - in production use proper i18n)
  let currency = 'USD';
  let currencySymbol = '$';
  if (country === 'Mexico') {
    currency = 'MXN';
    currencySymbol = '$';
  } else if (country === 'Spain') {
    currency = 'EUR';
    currencySymbol = '€';
  }

  return {
    greeting,
    locationMessage,
    currency,
    currencySymbol,
    timezone,
  };
};

/**
 * Detect device and connection quality
 */
export const getDeviceContext = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);

  // @ts-ignore - connection API not in all browsers
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  const connectionType = connection?.effectiveType || 'unknown';
  const isSlowConnection = ['slow-2g', '2g'].includes(connectionType);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    connectionType,
    isSlowConnection,
    saveData: connection?.saveData || false,
  };
};

/**
 * Optimize content delivery based on device context
 */
export const getOptimizedImageQuality = () => {
  const { isSlowConnection, saveData } = getDeviceContext();

  if (saveData || isSlowConnection) {
    return {
      quality: 60,
      format: 'webp',
      maxWidth: 800,
      message: '📶 Modo ahorro de datos activado',
    };
  }

  return {
    quality: 80,
    format: 'webp',
    maxWidth: 1200,
    message: null,
  };
};
