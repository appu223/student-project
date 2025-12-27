import { useState, useEffect } from 'react'
import axios from 'axios'
import { Book, User, Library, CheckCircle, XCircle, Home, RefreshCw, Clock, Smartphone, Mail, History } from 'lucide-react'
import { Link } from 'react-router-dom'

function LibraryProject() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [history, setHistory] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date()) // For live timer
  
  // Forms
  const [authorName, setAuthorName] = useState('')
  const [title, setTitle] = useState('')
  const [isbn, setIsbn] = useState('')
  const [authorId, setAuthorId] = useState('')
  
  // Modal State
  const [selectedBook, setSelectedBook] = useState(null)
  const [borrowForm, setBorrowForm] = useState({ name: '', email: '', mobile: '' })

  useEffect(() => { 
    refreshData()
    // Update timer every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/authors/').then(res => setAuthors(res.data))
    axios.get('http://127.0.0.1:8000/api/books/').then(res => setBooks(res.data))
    axios.get('http://127.0.0.1:8000/api/borrow-records/').then(res => setHistory(res.data))
  }

  const handleAddAuthor = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/authors/', { name: authorName }).then(() => { refreshData(); setAuthorName('') })
  }

  const handleAddBook = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/books/', { title, isbn, author: authorId }).then(() => { refreshData(); setTitle(''); setIsbn(''); })
  }

  // Confirm Borrow (Send data to backend)
  const submitBorrow = (e) => {
    e.preventDefault()
    if(!selectedBook) return

    axios.post(`http://127.0.0.1:8000/api/books/${selectedBook.id}/borrow/`, borrowForm)
      .then(() => {
        refreshData()
        setSelectedBook(null) // Close Modal
        setBorrowForm({ name: '', email: '', mobile: '' })
      })
      .catch(err => alert("Error borrowing book"))
  }

  const handleReturn = (bookId) => {
    if(!confirm("Return this book?")) return
    axios.post(`http://127.0.0.1:8000/api/books/${bookId}/return_book/`).then(() => refreshData())
  }

  // Calculate Session Time (HH:MM:SS)
  const getSessionDuration = (startTime) => {
    if (!startTime) return "00:00:00"
    const start = new Date(startTime)
    const diff = Math.floor((currentTime - start) / 1000) // difference in seconds
    
    if (diff < 0) return "Just now"

    const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
    const seconds = (diff % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-10">
      
      {/* HEADER */}
      <div className="bg-emerald-800 text-white p-6 shadow-lg">
         <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Library size={40} className="text-emerald-300" />
                <div>
                    <h1 className="text-3xl font-bold">Smart Library</h1>
                    <p className="text-emerald-300 text-sm">Session Tracking System</p>
                </div>
            </div>
            <Link to="/" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20"><Home size={16} /> Home</Link>
         </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: INPUTS */}
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-amber-500">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><User size={18}/> Add Author</h3>
                <form onSubmit={handleAddAuthor} className="flex gap-2">
                    <input className="flex-1 p-2 border rounded" placeholder="Author Name" value={authorName} onChange={e=>setAuthorName(e.target.value)} required />
                    <button className="bg-amber-500 text-white px-3 rounded font-bold">+</button>
                </form>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-emerald-500">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Book size={18}/> Add Book</h3>
                <form onSubmit={handleAddBook} className="space-y-3">
                    <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                    <div className="flex gap-2">
                        <input className="w-1/2 p-2 border rounded" placeholder="ISBN" value={isbn} onChange={e=>setIsbn(e.target.value)} required />
                        <select className="w-1/2 p-2 border rounded bg-white" value={authorId} onChange={e=>setAuthorId(e.target.value)} required>
                            <option value="">Select Author</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <button className="w-full bg-emerald-600 text-white py-2 rounded font-bold">Add Book</button>
                </form>
            </div>
        </div>

        {/* RIGHT: BOOK LIST */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Bookshelf</h2>
                <div className="space-y-3">
                    {books.map(book => (
                        <div key={book.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg border hover:shadow-md transition">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{book.title} <span className="text-xs font-normal text-gray-500">({book.isbn})</span></h3>
                                <p className="text-sm text-gray-500 mb-2">by {book.author_name}</p>
                                
                                {book.is_borrowed ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-sm inline-block">
                                        <div className="flex items-center gap-2 font-bold"><User size={14}/> {book.borrowed_by}</div>
                                        <div className="flex items-center gap-2 mt-1"><Clock size={14}/> Session: {getSessionDuration(book.borrowed_at)}</div>
                                    </div>
                                ) : (
                                    <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={14}/> Available</span>
                                )}
                            </div>

                            <div className="mt-3 md:mt-0">
                                {book.is_borrowed ? (
                                    <button onClick={() => handleReturn(book.id)} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black transition text-sm flex items-center gap-2">
                                        <RefreshCw size={14}/> Return
                                    </button>
                                ) : (
                                    <button onClick={() => setSelectedBook(book)} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm flex items-center gap-2">
                                        <Book size={14}/> Borrow
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* OVERALL BORROW HISTORY TABLE */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <History className="text-emerald-600"/> Overall Borrow List
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase">
                            <tr>
                                <th className="p-3">Book</th>
                                <th className="p-3">Student Info</th>
                                <th className="p-3">Borrowed At</th>
                                <th className="p-3">Returned At</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {history.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium">{record.book_title}</td>
                                    <td className="p-3">
                                        <div className="font-bold">{record.student_name}</div>
                                        <div className="text-gray-500 text-xs flex items-center gap-1"><Mail size={10}/> {record.email}</div>
                                        <div className="text-gray-500 text-xs flex items-center gap-1"><Smartphone size={10}/> {record.mobile}</div>
                                    </td>
                                    <td className="p-3">{new Date(record.borrow_date).toLocaleString()}</td>
                                    <td className="p-3">{record.return_date ? new Date(record.return_date).toLocaleString() : "-"}</td>
                                    <td className="p-3">
                                        {record.return_date 
                                            ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Returned</span>
                                            : <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs animate-pulse">Active</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {/* BORROW MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-emerald-600 text-white p-4">
                    <h3 className="text-lg font-bold">Borrow "{selectedBook.title}"</h3>
                </div>
                <form onSubmit={submitBorrow} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Student Name</label>
                        <input className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                            value={borrowForm.name} onChange={e=>setBorrowForm({...borrowForm, name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                        <input type="email" className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                            value={borrowForm.email} onChange={e=>setBorrowForm({...borrowForm, email: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
                        <input type="tel" className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                            value={borrowForm.mobile} onChange={e=>setBorrowForm({...borrowForm, mobile: e.target.value})} required />
                    </div>
                    <button 
    onClick={() => setHistory([
        { id: 99, book_title: "Test Book", student_name: "Test User", email: "test@test.com", mobile: "123", borrow_date: new Date(), return_date: null }
    ])}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
>
    🧪 Force Show Test Data
</button>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setSelectedBook(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-bold">Confirm Borrow</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  )
}

export default LibraryProject