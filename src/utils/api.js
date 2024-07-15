import axios from 'axios';

export const fetchGDPData = async (countryCode) => {
  try {
    const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.imf.org/external/datamapper/api/v1/NGDPD/${countryCode}`)}`);
    const data = JSON.parse(response.data.contents);
    return data.values.NGDPD[countryCode];
  } catch (error) {
    console.error('Error fetching GDP data:', error);
    return null;
  }
};