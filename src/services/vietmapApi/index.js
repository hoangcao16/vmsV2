import axios from 'axios';
const VietMapApi = {
  search: async (value, vietmapApiKey) => {
    let result;
    try {
      result = await axios.get(
        `https://maps.vietmap.vn/api/search?api-version=1.1&apikey=${vietmapApiKey}&text=${value}`,
      );
      console.log(result);
      return result.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
};
export default VietMapApi;
