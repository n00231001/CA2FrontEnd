import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

export default function Index() {
  const [appointments, setappointments] = useState([]);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchappointments = async () => {
      const options = {
        method: "GET",
        url: "/appointments",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setappointments(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchappointments();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("appointment deleted successfully");
    setappointments(appointments.filter(appointment => appointment.id !== id));
  
  };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/appointments/create`}>Create New appointment</Link>
      </Button>


    <Table>
      <TableCaption>A list of your recent appointments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{appointment.first_name} {appointment.last_name}</TableCell>
            <TableCell>{appointment.email}</TableCell>
            <TableCell>{appointment.phone}</TableCell>
            <TableCell>{appointment.date_of_birth}</TableCell>
            <TableCell>{appointment.address}</TableCell>
            <TableCell>{appointment.createdAt}</TableCell>
            <TableCell>{appointment.updatedAt}</TableCell>
            <TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={appointment.id} />
              </div>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
