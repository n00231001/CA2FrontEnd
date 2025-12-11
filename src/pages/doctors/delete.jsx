import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const options = {method: 'DELETE', url: 'https://ca2-med-api.vercel.app/doctors/42'};

try {
  if (!token) {
            console.error("No token found");
            toast.error("Please log in to delete a doctor");
            navigate('/doctors', { state: { from: '/doctors/create' } });
            return;
        }
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}