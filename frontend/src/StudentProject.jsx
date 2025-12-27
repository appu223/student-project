import { useState, useEffect } from 'react'
import axios from 'axios'
import { PlusCircle, Trash2, User, BookOpen, GraduationCap, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

function StudentProject() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  
  // Student Form Data
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')
  const [email, setEmail] = useState('')
  const [courseId, setCourseId] = useState('')

  // Course Form Data
  const [newCourseName, setNewCourseName] = useState('')
  const [showCourseInput, setShowCourseInput] = useState(false)

  // Fetch Data on Load
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Is Django running?", err))
      
    axios.get('http://127.0.0.1:8000/api/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.error("Is Django running?", err))
  }

  const handleStudentSubmit = (e) => {
    e.preventDefault()
    if (!courseId) {
      alert("Please select a course first!")
      return
    }
    axios.post('http://127.0.0.1:8000/api/students/', {
      name, roll_number: roll, email, course: courseId
    }).then(() => {
      refreshData()
      setName(''); setRoll(''); setEmail(''); // Clear form
    }).catch(err => alert("Error: Roll number must be unique!"))
  }

  const handleCourseSubmit = (e) => {
    e.preventDefault()
    if (!newCourseName) return
    axios.post('http://127.0.0.1:8000/api/courses/', { name: newCourseName })
      .then(() => {
        refreshData()
        setNewCourseName('')
        setShowCourseInput(false) // Hide input after success
      })
  }

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure?")) return
    axios.delete(`http://127.0.0.1:8000/api/students/${id}/`)
      .then(() => refreshData())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 font-sans text-gray-800">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="max-w-6xl mx-auto text-center text-white mb-10 relative">
        <Link to="/" className="absolute left-0 top-2 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-md transition">
            <Home size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-center items-center gap-3 mb-2 pt-12 md:pt-0">
            <GraduationCap size={48} />
            <h1 className="text-5xl font-extrabold tracking-tight">EduManager</h1>
        </div>
        <p className="text-indigo-100 text-lg opacity-90">Student & Course Management System</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FORMS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. COURSE MANAGER CARD */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <BookOpen className="text-indigo-600" /> Courses
                </h2>
                <button onClick={() => setShowCourseInput(!showCourseInput)} className="text-xs bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full hover:bg-indigo-200 transition">
                    {showCourseInput ? "Close" : "+ Add New"}
                </button>
            </div>
            
            {showCourseInput && (
                <form onSubmit={handleCourseSubmit} className="mb-4 flex gap-2 animate-fade-in">
                    <input type="text" placeholder="Course Name (e.g. Python)" className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={newCourseName} onChange={e => setNewCourseName(e.target.value)} autoFocus />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">Go</button>
                </form>
            )}

            <div className="flex flex-wrap gap-2">
                {courses.length === 0 ? <span className="text-sm text-gray-400 italic">No courses added yet.</span> : 
                 courses.map(c => (
                    <span key={c.id} className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full border">
                        {c.name}
                    </span>
                 ))
                }
            </div>
          </div>

          {/* 2. ADD STUDENT CARD */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <User className="text-pink-600" /> New Student
            </h2>
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" 
                    value={name} onChange={e => setName(e.target.value)} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Roll No</label>
                    <input type="text" placeholder="101" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" 
                        value={roll} onChange={e => setRoll(e.target.value)} required />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Course</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" 
                        value={courseId} onChange={e => setCourseId(e.target.value)} required>
                        <option value="">Select...</option>
                        {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" 
                    value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition transform duration-200">
                Create Student Profile
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-full border border-white/20 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span>Student Directory</span>
                <span className="text-sm font-normal bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{students.length} Students</span>
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <User size={64} className="mb-4 opacity-20" />
                        <p>No students found. Add one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map(student => (
                            <div key={student.id} className="group bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-wide mb-1">{student.course_name}</p>
                                    <p className="text-gray-500 text-sm">{student.email}</p>
                                    <p className="text-gray-400 text-xs mt-1">ID: {student.roll_number}</p>
                                </div>
                                <button onClick={() => handleDelete(student.id)} 
                                    className="text-gray-300 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentProject