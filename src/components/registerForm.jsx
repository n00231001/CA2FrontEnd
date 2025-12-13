import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';

export default function Create() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (payload) => {
    try {
      setSubmitting(true);

      const response = await axios.post("/registerForm", payload);

      console.log("Create success:", response.data);

      navigate('/users', {
        state: {
          type: 'success',
          message: 'User created successfully'
        }
      });
    } catch (err) {
  console.error("Create error:", err);

  if (err.response) {
    alert(
      `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
    );
  } else {
    alert(err.message);
  }
} finally {
      setSubmitting(false);
    }
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      name: `${form.first_name || ""} ${form.last_name || ""}`.trim()
    };

    createUser(payload);
  };

  return (
    <>
      <h1>Create a new user</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />

        <Input
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />

        <Input
          type="text"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          className="mt-4"
          variant="outline"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
}
