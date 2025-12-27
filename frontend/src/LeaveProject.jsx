import { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, CheckCircle, XCircle, User, Briefcase, Clock, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

function LeaveProject() {
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [view, setView] = useState('apply') // 'apply' or 'manager'
  
  // Forms
  const [empName, setEmpName] = useState('')
  const [dept, setDept] = useState('')
  const [email, setEmail] = useState('')
  
  const [empId, setEmpId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => { refreshData() }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/employees/').then(res => setEmployees(res.data))
    axios.get('http://127.0.0.1:8000/api/leaves/').then(res => setLeaves(res.data))
  }

  const handleAddEmployee = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/employees/', { name: empName, department: dept, email: email })
      .then(() => { refreshData(); setEmpName(''); setDept(''); setEmail('') })
  }

  const handleApplyLeave = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/leaves/', { 
        employee: empId, start_date: startDate, end_date: endDate, reason 
    }).then(() => {
        refreshData()
        alert("Leave Applied Successfully!")
        setReason('')
    }).catch(err => alert(err.response?.data?.error || "Error applying"))
  }

  const handleStatus = (id, status) => {
    axios.post(`http://127.0.0.1:8000/api/leaves/${id}/update_status/`, { status })
      .then(() => refreshData())
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-800 p-8">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="text-blue-600"/> HR Portal
            </h1>
            <p className="text-slate-500">Leave Management System</p>
        </div>
        <div className="flex gap-4">
            <button onClick={() => setView('apply')} className={`px-4 py-2 rounded-lg font-bold transition ${view === 'apply' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>Apply Leave</button>
            <button onClick={() => setView('manager')} className={`px-4 py-2 rounded-lg font-bold transition ${view === 'manager' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}>Manager View</button>
            <Link to="/" className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"><Home size={18}/></Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: EMPLOYEE SETUP */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                <h3 className="font-bold mb-4 flex items-center gap-2"><User size={20}/> Register Employee</h3>
                <form onSubmit={handleAddEmployee} className="space-y-3">
                    <input className="w-full p-2 border rounded" placeholder="Name" value={empName} onChange={e=>setEmpName(e.target.value)} required />
                    <input className="w-full p-2 border rounded" placeholder="Department" value={dept} onChange={e=>setDept(e.target.value)} required />
                    <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Register</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold mb-4">Employee Directory</h3>
                <div className="space-y-2 h-48 overflow-y-auto">
                    {employees.map(emp => (
                        <div key={emp.id} className="text-sm bg-slate-50 p-2 rounded border flex justify-between">
                            <span>{emp.name}</span>
                            <span className="text-gray-500 text-xs bg-gray-200 px-2 rounded-full">{emp.department}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT: DYNAMIC VIEW */}
        <div className="lg:col-span-2">
            
            {/* VIEW 1: APPLY LEAVE */}
            {view === 'apply' && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock/> Apply for Leave</h2>
                    <form onSubmit={handleApplyLeave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-500 mb-1">Select Employee</label>
                            <select className="w-full p-3 border rounded bg-white" value={empId} onChange={e=>setEmpId(e.target.value)} required>
                                <option value="">-- Choose Name --</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-1">Start Date</label>
                            <input type="date" className="w-full p-3 border rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-1">End Date</label>
                            <input type="date" className="w-full p-3 border rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-500 mb-1">Reason</label>
                            <textarea className="w-full p-3 border rounded h-24" placeholder="Why do you need leave?" value={reason} onChange={e=>setReason(e.target.value)} required />
                        </div>
                        <button className="md:col-span-2 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                            Submit Request
                        </button>
                    </form>
                </div>
            )}

            {/* VIEW 2: MANAGER APPROVAL */}
            {view === 'manager' && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-500 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CheckCircle/> Manager Dashboard</h2>
                    
                    <div className="space-y-4">
                        {leaves.length === 0 ? <p className="text-gray-400">No leave requests found.</p> :
                         leaves.map(leave => (
                            <div key={leave.id} className="border border-gray-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center hover:bg-slate-50 transition">
                                <div className="mb-4 md:mb-0">
                                    <h4 className="font-bold text-lg text-slate-800">{leave.employee_name}</h4>
                                    <p className="text-sm text-slate-500">{leave.start_date} <span className="text-black font-bold">to</span> {leave.end_date}</p>
                                    <p className="text-sm text-gray-600 mt-1 italic">"{leave.reason}"</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded mt-2 inline-block
                                        ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                          leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {leave.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                {leave.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatus(leave.id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-bold text-sm">Approve</button>
                                        <button onClick={() => handleStatus(leave.id, 'Rejected')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold text-sm">Reject</button>
                                    </div>
                                )}
                            </div>
                         ))
                        }
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  )
}

export default LeaveProject