import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, Calendar, Clock, User, Plus, Stethoscope, Home, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

function HospitalProject() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  
  // Forms
  const [docName, setDocName] = useState(''); const [spec, setSpec] = useState('')
  const [patName, setPatName] = useState(''); const [age, setAge] = useState(''); const [phone, setPhone] = useState('')
  
  // Booking Form
  const [bDoc, setBDoc] = useState('')
  const [bPat, setBPat] = useState('')
  const [bDate, setBDate] = useState('')
  const [bTime, setBTime] = useState('')
  const [bReason, setBReason] = useState('')

  useEffect(() => { refreshData() }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/doctors/').then(res => setDoctors(res.data))
    axios.get('http://127.0.0.1:8000/api/patients/').then(res => setPatients(res.data))
    axios.get('http://127.0.0.1:8000/api/appointments/').then(res => setAppointments(res.data))
  }

  const handleAddDoctor = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/doctors/', { name: docName, specialization: spec })
      .then(() => { refreshData(); setDocName(''); setSpec('') })
  }

  const handleAddPatient = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/patients/', { name: patName, age, phone })
      .then(() => { refreshData(); setPatName(''); setAge(''); setPhone('') })
  }

  const handleBook = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/appointments/', {
        doctor: bDoc, patient: bPat, date: bDate, time: bTime, reason: bReason
    }).then(() => {
        alert("Appointment Booked Successfully!")
        refreshData()
        setBReason('')
    }).catch(err => {
        // Show Logic Error
        alert(err.response?.data?.error || "Error booking appointment")
    })
  }

  return (
    <div className="min-h-screen bg-cyan-50 font-sans text-gray-800 p-8">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-cyan-900 flex items-center gap-2">
                <Activity className="text-red-500"/> MediCare System
            </h1>
            <p className="text-cyan-700">Hospital Administration & Scheduling</p>
        </div>
        <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:bg-cyan-100 transition">
            <Home size={18}/> Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: RESOURCES */}
        <div className="space-y-6">
            
            {/* ADD DOCTOR */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-cyan-500">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Stethoscope size={18}/> Add Doctor</h3>
                <form onSubmit={handleAddDoctor} className="space-y-3">
                    <input className="w-full p-2 border rounded bg-gray-50" placeholder="Doctor Name" value={docName} onChange={e=>setDocName(e.target.value)} required />
                    <input className="w-full p-2 border rounded bg-gray-50" placeholder="Specialization" value={spec} onChange={e=>setSpec(e.target.value)} required />
                    <button className="w-full bg-cyan-600 text-white font-bold py-2 rounded hover:bg-cyan-700">Register Doctor</button>
                </form>
            </div>

            {/* ADD PATIENT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={18}/> Add Patient</h3>
                <form onSubmit={handleAddPatient} className="space-y-3">
                    <input className="w-full p-2 border rounded bg-gray-50" placeholder="Patient Name" value={patName} onChange={e=>setPatName(e.target.value)} required />
                    <div className="flex gap-2">
                        <input className="w-1/3 p-2 border rounded bg-gray-50" placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} required />
                        <input className="w-2/3 p-2 border rounded bg-gray-50" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} required />
                    </div>
                    <button className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">Register Patient</button>
                </form>
            </div>

        </div>

        {/* MIDDLE: BOOKING */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-500 h-fit">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar/> Book Appointment</h2>
            <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Doctor</label>
                        <select className="w-full p-3 border rounded bg-white" value={bDoc} onChange={e=>setBDoc(e.target.value)} required>
                            <option value="">Select...</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Patient</label>
                        <select className="w-full p-3 border rounded bg-white" value={bPat} onChange={e=>setBPat(e.target.value)} required>
                            <option value="">Select...</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                        <input type="date" className="w-full p-3 border rounded" value={bDate} onChange={e=>setBDate(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Time</label>
                        <input type="time" className="w-full p-3 border rounded" value={bTime} onChange={e=>setBTime(e.target.value)} required />
                    </div>
                </div>
                
                <input className="w-full p-3 border rounded" placeholder="Reason for visit..." value={bReason} onChange={e=>setBReason(e.target.value)} required />
                
                <button className="w-full bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600 shadow-lg hover:shadow-xl transition">
                    Confirm Appointment
                </button>
            </form>
        </div>

        {/* RIGHT: LIST */}
        <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Scheduled Appointments</h3>
            
            {appointments.length === 0 ? <p className="text-gray-400">No appointments scheduled.</p> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map(appt => (
                    <div key={appt.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-400 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-gray-800">Dr. {appt.doctor_name}</h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">{appt.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><User size={14}/> {appt.patient_name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14}/> {appt.date}</p>
                            <p className="mt-3 text-sm italic text-gray-600">"{appt.reason}"</p>
                        </div>
                    </div>
                ))}
            </div>
            }
        </div>

      </div>
    </div>
  )
}

export default HospitalProject