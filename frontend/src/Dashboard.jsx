import { Link } from 'react-router-dom'
import { BookOpen, Library, TrendingUp, Edit3, Briefcase, Box, Calendar, CheckSquare, Activity } from 'lucide-react'

const projects = [
  { id: 1, title: "Student Management", icon: <BookOpen size={24} />, path: "/student", status: "Live", color: "from-blue-500 to-cyan-400" },
 { 
  id: 2, 
  title: "Library Tracker", 
  icon: <Library size={24} />, 
  path: "/library", 
  status: "Live",  // <--- Change "Coming Soon" to "Live"
  color: "from-purple-500 to-pink-500" 
},
 { 
  id: 3, 
  title: "Expense Tracker", 
  icon: <TrendingUp size={24} />, 
  path: "/expense", 
  status: "Live",  // <--- Changed to Live
  color: "from-green-400 to-emerald-600" 
},
 { 
  id: 4, 
  title: "Blog Platform", 
  icon: <Edit3 size={24} />, 
  path: "/blog", 
  status: "Live", 
  color: "from-orange-400 to-red-500" 
},
 { 
  id: 5, 
  title: "Employee Leave", 
  icon: <Briefcase size={24} />, 
  path: "/employee", 
  status: "Live", 
  color: "from-indigo-400 to-blue-600" 
},
  { 
  id: 6, 
  title: "Inventory System", 
  icon: <Box size={24} />, 
  path: "/inventory", 
  status: "Live", 
  color: "from-yellow-400 to-orange-500" 
},
  { 
  id: 7, 
  title: "Event Registration", 
  icon: <Calendar size={24} />, 
  path: "/event", 
  status: "Live", 
  color: "from-pink-400 to-rose-600" 
},
  { 
  id: 8, 
  title: "Online Quiz Manager", 
  icon: <CheckSquare size={24} />, 
  path: "/quiz", 
  status: "Live", 
  color: "from-teal-400 to-cyan-600" 
},
 { 
  id: 9, 
  title: "Hospital Appointment System", 
  icon: <Activity size={24} />, 
  path: "/hospital", 
  status: "Live", 
  color: "from-red-400 to-pink-600" 
},
]

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left">
            {/* UPDATED TITLE HERE */}
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg">
              CRUD Operations
            </h1>
            <p className="text-xl text-gray-300 mt-2 tracking-widest uppercase">Project Control Center</p>
          </div>
          <div className="mt-6 md:mt-0 bg-white/10 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md">
             <span className="text-cyan-400 font-bold">● System Online</span>
          </div>
        </header>

        {/* GRID OF PROJECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link to={project.status === "Live" ? project.path : "#"} key={project.id}
              className={`group relative bg-gray-900/40 border border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 ${project.status !== "Live" && "opacity-60 cursor-not-allowed"}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-10 rounded-2xl transition duration-500 blur-xl`}></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${project.color} shadow-lg`}>{project.icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${project.status === "Live" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-gray-700/50 text-gray-400 border-gray-600"}`}>{project.status}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
              <p className="text-gray-400 text-sm">Task ID: 0{project.id}</p>
              {project.status === "Live" && <div className="mt-4 flex items-center text-sm text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">Launch System &rarr;</div>}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}