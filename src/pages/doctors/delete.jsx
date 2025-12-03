import axios from 'axios';

const options = {method: 'DELETE', url: 'https://ca2-med-api.vercel.app/doctors/42'};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}