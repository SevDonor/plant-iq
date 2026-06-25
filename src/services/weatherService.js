import { mockSnapshot } from '../data/mockData';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const DEFAULT_LOCATION = 'Ho Chi Minh City';

const getUvLabel = (uv) => {
  if (uv <= 2) return 'Thấp';
  if (uv <= 5) return 'Trung bình';
  if (uv <= 7) return 'Cao';
  if (uv <= 10) return 'Rất cao';
  return 'Nguy hiểm';
};

const getTip = (condition, uv) => {
  if (condition.toLowerCase().includes('mưa')) {
    return 'Trời có mưa, hạn chế tưới nước thêm nếu cây để ngoài trời.';
  }
  if (uv >= 6) {
    return 'UV đang khá cao, tránh để cây trực tiếp dưới nắng gắt.';
  }
  return 'Thời tiết lý tưởng, cây có thể hấp thụ ánh sáng tốt hôm nay.';
};

export const fetchCurrentWeather = async (locationQuery = DEFAULT_LOCATION) => {
  if (!API_KEY) {
    console.warn('VITE_WEATHER_API_KEY is not defined. Falling back to mock weather data.');
    return mockSnapshot.weather;
  }

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(locationQuery)}&lang=vi`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const current = data.current;
    
    return {
      location: `${data.location.name}, ${data.location.country}`,
      temperature: Math.round(current.temp_c),
      condition: current.condition.text,
      feelsLike: Math.round(current.feelslike_c),
      humidity: current.humidity,
      wind: current.wind_kph,
      visibility: current.vis_km,
      uv: current.uv,
      uvLabel: getUvLabel(current.uv),
      tip: getTip(current.condition.text, current.uv),
    };
  } catch (error) {
    console.error('Failed to fetch real weather data, using mock:', error);
    return mockSnapshot.weather;
  }
};
