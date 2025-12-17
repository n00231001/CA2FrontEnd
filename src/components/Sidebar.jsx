import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react"; // optional icon, install/replace if needed

export default function Sidebar() {
  return (
    <aside className="w-60 p-4 border-r">
      <nav className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          Home
        </Link>

        <Link to="/doctors" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          Doctors
        </Link>

        <Link to="/patients" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          Patients
        </Link>

        <Link to="/prescriptions" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          Prescriptions
        </Link>

        <Link to="/appointments" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          Appointments
        </Link>
      </nav>
    </aside>
  );
}