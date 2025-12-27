import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import StudentProject from './StudentProject'
import LibraryProject from './LibraryProject' // <--- DID YOU ADD THIS LINE?
import ExpenseProject from './ExpenseProject' // <--- DID YOU ADD THIS LINE?  
import BlogProject from './BlogProject'
import LeaveProject from './LeaveProject'
import InventoryProject from './InventoryProject'
import EventProject from './EventProject'
import QuizProject from './QuizProject'
import HospitalProject from './HospitalProject'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/student" element={<StudentProject />} />
        <Route path="/expense" element={<ExpenseProject />} />
        <Route path="/library" element={<LibraryProject />} />
        <Route path="/blog" element={<BlogProject />} />
        <Route path="/employee" element={<LeaveProject />} />
        <Route path="/inventory" element={<InventoryProject />} />
        <Route path="/event" element={<EventProject />} />
        <Route path="/quiz" element={<QuizProject />} />
        <Route path="/hospital" element={<HospitalProject />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App