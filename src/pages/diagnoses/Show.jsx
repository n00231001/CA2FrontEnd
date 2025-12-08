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
  const [diagnosis, setdiagnosis] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchdiagnosis = async () => {
      const options = {
        method: "GET",
        url: `/diagnoses/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setdiagnosis(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchdiagnosis();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{diagnosis.title}</CardTitle>
        <CardDescription>
          {diagnosis.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img src={diagnosis.image_path} alt={diagnosis.title} />
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
