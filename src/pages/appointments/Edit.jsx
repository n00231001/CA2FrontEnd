import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
 
export default function Edit() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialisation: "",
  });
 
  const { token } = useAuth();
  const { id } = useParams();
 
  useEffect(() => {
    const fetchappointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
 
      try {
        let response = await axios.request(options);
        let appointment = response.data;
        console.log(appointment);
 
        setForm({
          first_name: appointment.first_name,
          last_name: appointment.last_name,
          email: appointment.email,
          phone: appointment.phone,
          specialisation: appointment.specialisation,
        });
 
      } catch (err) {
        console.log(err);
      }
    };
 
    fetchappointment();
  }, []);
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
 
  const updateappointment = async () => {
    const options = {
      method: "PATCH",
      url: `/appointments/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };
 
    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/appointments");
    } catch (err) {
      console.log(err);
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    updateappointment();
  };
 
  return (
    <>
      <h1>Update appointment</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Specialisation"
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}