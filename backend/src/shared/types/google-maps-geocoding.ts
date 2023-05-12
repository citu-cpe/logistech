export interface GoogleMapsGeocoding {
  results: GoogleMapsGeocodingResult[];
  status: string;
}

interface GoogleMapsGeocodingResult {
  address_components: GoogleMapsGeocodingAddressComponent[];
  formatted_address: string;
  geometry: GoogleMapsGeocodingGeometry;
  place_id: string;
  plus_code: GoogleMapsGeocodingPlusCode;
  types: string[];
}

interface GoogleMapsGeocodingAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsGeocodingGeometry {
  location: GoogleMapsGeocodingLocation;
  location_type: string;
  viewport: GoogleMapsGeocodingViewport;
}

interface GoogleMapsGeocodingLocation {
  lat: number;
  lng: number;
}

interface GoogleMapsGeocodingViewport {
  northeast: GoogleMapsGeocodingLocation;
  southwest: GoogleMapsGeocodingLocation;
}

interface GoogleMapsGeocodingPlusCode {
  compound_code: string;
  global_code: string;
}
