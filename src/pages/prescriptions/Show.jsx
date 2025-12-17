import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Show() {
  const [prescription, setprescription] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  // simple set of 5 colors for the avatar
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  const avatarColor = (() => {
    const n = Number(id);
    if (!Number.isNaN(n)) return COLORS[Math.abs(n) % COLORS.length];
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  })();

  useEffect(() => {
    const fetchprescription = async () => {
      const options = {
        method: "GET",
        url: `/prescriptions/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setprescription(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchprescription();
  }, [id, token]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dr. {prescription.first_name} {prescription.last_name}</CardTitle>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: avatarColor, color: '#fff' }}
        >
          {prescription.first_name?.split(" ").map(n => n[0]).join("")}
        </div>
        <CardDescription>
          <h1>prescription Details:</h1>
          <p>Email: {prescription.email}</p>
          <p>Specialization: {prescription.specialization}</p>
          <p>Phone: {prescription.phone}</p>
          <p>Created At: {prescription.created_at}</p>
          <p>Updated At: {prescription.updated_at}</p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
