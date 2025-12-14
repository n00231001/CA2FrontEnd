import { useState } from 'react';
import axios from '@/config/api';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DeleteAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!token) {
      toast.error('Please log in to delete an appointment');
      navigate('/appointments');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Appointment deleted');
      navigate('/appointments', {
        state: { type: 'success', message: 'Appointment deleted successfully' },
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Delete Appointment</h1>
      <p className="text-muted-foreground">
        Are you sure you want to delete appointment with ID {id}?
      </p>
      <div className="flex gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Yes, delete'}
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}