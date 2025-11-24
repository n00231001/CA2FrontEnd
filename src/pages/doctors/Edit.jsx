import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
  const [form, setForm] = useState({
    First_name: "",
    Last_name: "",
    Email: "",
    Phone: "",
  });

  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let doctor = response.data;
        setForm({
            title: doctor.title,
            description: doctor.description,
            city: doctor.city,
            start_date: doctor.start_date,
            end_date: doctor.end_date,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateDoctor = async () => {
    

    const options = {
      method: "PATCH",
      url: `/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateDoctor();
  };

  return (
    <>
      <h1>Update Doctor</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First Name"
          name="First_name"
          value={form.First_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Last Name"
          name="Last_name"
          value={form.Last_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Email"
          name="Email"
          value={form.Email}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Phone"
          name="Phone"
          value={form.Phone}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
