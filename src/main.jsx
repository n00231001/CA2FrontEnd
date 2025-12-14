import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import '@/assets/globals.css'
import AppLayout from '@/App.jsx'
import Home from '@/pages/Home.jsx'
import Signup from '@/pages/Signup.jsx'
import AppointmentsIndex from '@/pages/appointments/Index.jsx'
import AppointmentsCreate from '@/pages/appointments/Create.jsx'
import AppointmentsShow from '@/pages/appointments/Show.jsx'
import AppointmentsEdit from '@/pages/appointments/Edit.jsx'
import AppointmentsDelete from '@/pages/appointments/Delete.jsx'
import DoctorsIndex from '@/pages/doctors/Index.jsx'
import DoctorsCreate from '@/pages/doctors/Create.jsx'
import DoctorsShow from '@/pages/doctors/Show.jsx'
import DoctorsEdit from '@/pages/doctors/Edit.jsx'
import DoctorsDelete from '@/pages/doctors/delete.jsx'
import PatientsIndex from '@/pages/patients/Index.jsx'
import PatientsCreate from '@/pages/patients/Create.jsx'
import PatientsShow from '@/pages/patients/Show.jsx'
import PatientsEdit from '@/pages/patients/Edit.jsx'
import DiagnosesIndex from '@/pages/diagnoses/Index.jsx'
import DiagnosesCreate from '@/pages/diagnoses/Create.jsx'
import DiagnosesShow from '@/pages/diagnoses/Show.jsx'
import DiagnosesEdit from '@/pages/diagnoses/Edit.jsx'
import RegisterCreate from '@/pages/register/create.jsx'
import { AuthProvider } from '@/hooks/useAuth.jsx'
import { ThemeProvider } from 'next-themes'

const NotFound = () => (
  <div className="p-6">
    <h1 className="text-xl font-semibold">Page not found</h1>
    <p className="text-muted-foreground">Check the URL or use the navigation menu.</p>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'appointments', element: <AppointmentsIndex /> },
      { path: 'appointments/create', element: <AppointmentsCreate /> },
      { path: 'appointments/:id', element: <AppointmentsShow /> },
      { path: 'appointments/:id/edit', element: <AppointmentsEdit /> },
      { path: 'appointments/:id/delete', element: <AppointmentsDelete /> },
      { path: 'doctors', element: <DoctorsIndex /> },
      { path: 'doctors/create', element: <DoctorsCreate /> },
      { path: 'doctors/:id', element: <DoctorsShow /> },
      { path: 'doctors/:id/edit', element: <DoctorsEdit /> },
      { path: 'doctors/:id/delete', element: <DoctorsDelete /> },
      { path: 'patients', element: <PatientsIndex /> },
      { path: 'patients/create', element: <PatientsCreate /> },
      { path: 'patients/:id', element: <PatientsShow /> },
      { path: 'patients/:id/edit', element: <PatientsEdit /> },
      { path: 'diagnoses', element: <DiagnosesIndex /> },
      { path: 'diagnoses/create', element: <DiagnosesCreate /> },
      { path: 'diagnoses/:id', element: <DiagnosesShow /> },
      { path: 'diagnoses/:id/edit', element: <DiagnosesEdit /> },
    ],
  },
  { path: '/signup', element: <Signup /> },
  { path: '/register', element: <RegisterCreate /> },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
