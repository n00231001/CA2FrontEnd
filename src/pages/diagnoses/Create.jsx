import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
    const [form, setForm] = useState({
        patient_id: "",
        diagnosis_date: "",
        condition: "",
        diagnosed_with: "",
        created_at: "",
        updated_at: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createappointment = async () => {
        if (!token) {
            alert("Not authenticated. Please log in.");
            return;
        }

        // Some APIs expect a single "name" field — include it alongside other fields
        const payload = {
            ...form,
            name: `${form.patient_id || ""} ${form.condition || ""}`.trim()
        };

        const options = {
            method: "POST",
            url: `/appointments`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: payload
        };

        try {
            setSubmitting(true);
            let response = await axios.request(options);
            console.log("Create success:", response.data);
            navigate('/appointments', { state: { 
                type: 'success',
                message: `appointment "${response.data.name || response.data.title || response.data.patient_id || 'created'}" created successfully` 
            }});
        } catch (err) {
            console.error("Create error:", err);
            if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
                // Show server-side validation details when available
                if (err.response.status === 422) {
                    const serverData = err.response.data;
                    const details = serverData?.errors || serverData?.message || serverData;
                    alert(`Validation failed: ${JSON.stringify(details)}`);
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
        // basic client-side validation to avoid obvious 422s
        if (!form.patient_id.trim() || !form.condition.trim() ) {
            alert("Please provide first name, last name and email.");
            return;
        }
        console.log("Submitting payload:", { ...form, name: `${form.patient_id} ${form.condition}`.trim() });
        createappointment();
    };

  return (
    <>
        <h1>Create a new appointment</h1>
        <form onSubmit={handleSubmit}>
            <Input 
                type="text" 
                placeholder="patient ID" 
                name="patient_id" 
                value={form.patient_id} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="diagnosis date" 
                name="diagnosis_date" 
                value={form.diagnosis_date} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="Condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="Diagnosed With"
                name="diagnosed_with"
                value={form.diagnosed_with}
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
            {/* <Input 
                className="mt-2"
                type="text" 
                placeholder="Start Date" 
                name="start_date" 
                value={form.start_date} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="End Date" 
                name="end_date" 
                value={form.end_date} 
                onChange={handleChange} 
            /> */}
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