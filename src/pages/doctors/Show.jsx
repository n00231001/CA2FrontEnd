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
  const [doctor, setDoctor] = useState([]);
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
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, [id, token]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dr. {doctor.first_name} {doctor.last_name}</CardTitle>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: avatarColor, color: '#fff' }}
        >
          {doctor.first_name?.split(" ").map(n => n[0]).join("")}
        </div>
        <CardDescription>
          <h1>Doctor Details:</h1>
          <p>Email: {doctor.email}</p>
          <p>Specialization: {doctor.specialization}</p>
          <p>Phone: {doctor.phone}</p>
          <p>Created At: {doctor.created_at}</p>
          <p>Updated At: {doctor.updated_at}</p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
