import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// use plain axios here so the app-level interceptor (that adds Authorization) is not applied
import axios from "axios";
import { useNavigate } from 'react-router';

export default function Create() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        created_at: "",
        updated_at: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createuser = async () => {
        try {
            setSubmitting(true);
            // use a fresh axios instance so any global interceptors (that add Authorization) are not used
            const client = axios.create({
              baseURL: "https://ca2-med-api.vercel.app",
              headers: { "Content-Type": "application/json" }
            });

            const response = await client.post(
                "/registerForm",
                { ...form, name: `${form.first_name || ""} ${form.last_name || ""}`.trim() }
            );

            console.log("Create success:", response.data);
            navigate('/users', { state: { 
                type: 'success',
                message: `user "${response.data.name || response.data.title || response.data.first_name || 'created'}" created successfully` 
            }});
        } catch (err) {
            console.error("Create error:", err);
            if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
                if (err.response.status === 422) {
                    const serverData = err.response.data;
                    const details = serverData?.errors || serverData?.message || serverData;
                    alert(`Validation failed: ${JSON.stringify(details)}`);
                } else if (err.response.status === 401 || /authorization/i.test(String(err.response.data))) {
                    // helpful message if server still requires auth
                    alert("Create failed: the server requires authorization for this endpoint. Contact the API owner or use the public registration endpoint.");
                } else {
                    const msg = err.response.data?.message || JSON.stringify(err.response.data);
                    alert(`Create failed: ${msg}`);
                }
            } else {
                alert("Network error or no response from server.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
            alert("Please provide first name, last name and email.");
            return;
        }
        console.log("Submitting payload:", { ...form, name: `${form.first_name} ${form.last_name}`.trim() });
        createuser();
    };

  return (
    <>
        <h1>Create a new user</h1>
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
                type="text" 
                placeholder="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="created at"
                name="created_at"
                value={form.created_at}
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="updated at"
                name="updated_at"
                value={form.updated_at}
                onChange={handleChange}
            />
            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit"
                disabled={submitting}
            >{submitting ? "Submitting..." : "Submit"}</Button>
        </form>
    </>
  );
}