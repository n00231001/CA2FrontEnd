import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

// toast for user feedback
import { toast } from "sonner";

export default function Create() {
    // Use plain JS initializers (no TypeScript generics in a .jsx file)
    // and keep string defaults so inputs remain controlled.
    const [form, setForm] = useState({
        date_of_birth: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "", // added required field so request matches Zod schema
        
    });
    const [date, setDate] = React.useState(new Date())
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAuth();
    // debug: show token value so you can confirm auth state
    console.log('useAuth token:', token);
    
    // show a single toast error when auth is known and user is not authenticated
    React.useEffect(() => {
        if (token === undefined) return; // still initializing
        if (!token) {
            toast.error("You must be logged in to create appointments");
        }
    }, [token]);
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };
    
    const createappointment = async (data) => {
        // guard — redirect to login if token disappears
        if (!token) {
            console.error("No token found");
            toast.error("Please log in to create an appointment");
            navigate('/patients', { state: { from: '/patients/create' } });
            return;
        }

        const options = {
            method: "POST",
            url: `/patients`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: data
        };

        try {
            setSubmitting(true);
            let response = await axios.request(options);
            console.log("Create success:", response.data);
            navigate('/patients', { state: { 
                type: 'success',
                message: `patient "${response.data.name || response.data.first_name || 'created'}" created successfully` 
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
        // basic client-side validation for patient create
        if (!form.first_name?.trim()) {
            alert("Please provide first name.");
            return;
        }
        if (!form.last_name?.trim()) {
            alert("Please provide last name.");
            return;
        }
        if (!form.email?.trim()) {
            alert("Please provide email.");
            return;
        }
        if (!form.phone?.trim()) {
            alert("Please provide phone.");
            return;
        }
        // stamp created_at and updated_at with current ISO timestamp
        const now = new Date().toISOString();
        const submitData = {
            ...form,
            created_at: now,
            updated_at: now
        };
        console.log("Submitting payload:", submitData);
        createappointment(submitData);
    };

  return (
    <>
        <h1>Create a new patient</h1>
        <form onSubmit={handleSubmit}>
            {/* Date picker as a dropdown popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder="Select date of birth"
                  name="date_of_birth"
                  readOnly
                  value={form.date_of_birth}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div style={{ padding: 8 }}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      const iso = d ? d.toISOString().slice(0, 10) : "";
                      setForm(prev => ({ ...prev, date_of_birth: iso }));
                    }}
                    className="rounded-lg border"
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Input 
                className="mt-2"
                type="text"
                placeholder="First name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="Last name"
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
                type="text"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text"
                placeholder="Address"
                name="address"
                value={form.address}
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