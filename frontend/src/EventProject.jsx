import { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, MapPin, Users, Ticket, Home, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function EventProject() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null) // For Modal
  
  // Forms
  const [eventName, setEventName] = useState('')
  const [date, setDate] = useState('')
  const [loc, setLoc] = useState('')
  const [cap, setCap] = useState('')

  // Registration Form
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => { refreshData() }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/events/').then(res => setEvents(res.data))
  }

  const handleCreateEvent = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/events/', { 
        name: eventName, date, location: loc, total_capacity: cap, description: "Official Event" 
    }).then(() => {
        refreshData()
        setEventName(''); setDate(''); setLoc(''); setCap('')
    })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/attendees/', {
        event: selectedEvent.id, name: userName, email: userEmail
    }).then(() => {
        alert("Registration Successful! Ticket sent to email.")
        refreshData()
        setSelectedEvent(null) // Close Modal
        setUserName(''); setUserEmail('')
    }).catch(err => {
        // Show specific error from Backend (Duplicate or Full)
        alert(err.response?.data?.error || "Registration Failed")
    })
  }

  return (
    <div className="min-h-screen bg-fuchsia-50 font-sans text-gray-800 p-8">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
            <h1 className="text-4xl font-extrabold text-fuchsia-900 flex items-center gap-2">
                <Ticket className="text-fuchsia-600"/> EventMaster
            </h1>
            <p className="text-fuchsia-700">Booking & Registration System</p>
        </div>
        <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:bg-fuchsia-100 transition">
            <Home size={18}/> Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: CREATE EVENT */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-fuchsia-600 h-fit">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Plus className="bg-fuchsia-100 text-fuchsia-600 p-1 rounded-full"/> Create Event
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
                <input className="w-full p-3 bg-fuchsia-50 border-none rounded-lg focus:ring-2 focus:ring-fuchsia-400" 
                    placeholder="Event Name" value={eventName} onChange={e=>setEventName(e.target.value)} required />
                <input type="date" className="w-full p-3 bg-fuchsia-50 border-none rounded-lg" 
                    value={date} onChange={e=>setDate(e.target.value)} required />
                <input className="w-full p-3 bg-fuchsia-50 border-none rounded-lg" 
                    placeholder="Location" value={loc} onChange={e=>setLoc(e.target.value)} required />
                <input type="number" className="w-full p-3 bg-fuchsia-50 border-none rounded-lg" 
                    placeholder="Total Capacity (e.g. 50)" value={cap} onChange={e=>setCap(e.target.value)} required />
                
                <button className="w-full bg-fuchsia-600 text-white font-bold py-3 rounded-lg hover:bg-fuchsia-700 transition transform hover:scale-105">
                    Launch Event
                </button>
            </form>
        </div>

        {/* RIGHT: EVENT LIST */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-2xl text-gray-700">Upcoming Events</h3>
            
            {events.length === 0 ? <p className="text-gray-400 italic">No events scheduled.</p> :
             events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center group hover:shadow-2xl transition">
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
                            {event.is_full ? (
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Sold Out</span>
                            ) : (
                                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Open</span>
                            )}
                        </div>
                        
                        <div className="text-gray-500 space-y-1 mb-4">
                            <p className="flex items-center gap-2"><Calendar size={16}/> {event.date}</p>
                            <p className="flex items-center gap-2"><MapPin size={16}/> {event.location}</p>
                        </div>

                        {/* CAPACITY BAR */}
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-1">
                            <div className={`h-2.5 rounded-full ${event.is_full ? 'bg-red-500' : 'bg-green-500'}`} 
                                 style={{ width: `${(event.registered_count / event.total_capacity) * 100}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-gray-400">
                            {event.registered_count} / {event.total_capacity} Registered
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <button 
                            onClick={() => setSelectedEvent(event)} 
                            disabled={event.is_full}
                            className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition
                                ${event.is_full ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:scale-105'}`}
                        >
                            {event.is_full ? "Event Full" : "Register Now"}
                        </button>
                    </div>
                </div>
             ))
            }
        </div>

      </div>

      {/* REGISTRATION MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in relative">
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
                
                <h2 className="text-2xl font-bold mb-1">Register for {selectedEvent.name}</h2>
                <p className="text-gray-500 text-sm mb-6">Secure your spot today!</p>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                        <input className="w-full p-3 border rounded-lg outline-none focus:border-fuchsia-500" 
                            value={userName} onChange={e=>setUserName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <input type="email" className="w-full p-3 border rounded-lg outline-none focus:border-fuchsia-500" 
                            value={userEmail} onChange={e=>setUserEmail(e.target.value)} required />
                    </div>
                    <button className="w-full bg-fuchsia-600 text-white font-bold py-3 rounded-lg hover:bg-fuchsia-700 mt-2">
                        Confirm Registration
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  )
}

export default EventProject