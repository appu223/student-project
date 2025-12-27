import { useState, useEffect } from 'react'
import axios from 'axios'
import { DollarSign, PieChart, Plus, Trash2, Home, Tag, Calendar, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

function ExpenseProject() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  
  // Forms
  const [catName, setCatName] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [catId, setCatId] = useState('')

  // NEW: Filter State
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => { refreshData() }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/categories/').then(res => setCategories(res.data))
    axios.get('http://127.0.0.1:8000/api/expenses/').then(res => setExpenses(res.data))
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/categories/', { name: catName })
      .then(() => { refreshData(); setCatName('') })
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/expenses/', { title, amount, category: catId })
      .then(() => { refreshData(); setTitle(''); setAmount(''); })
  }

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`).then(refreshData)
  }

  // --- LOGIC: FILTERING ---
  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category_name === filterCategory)

  // Calculate Total based on the FILTERED list
  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100 p-6">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <DollarSign size={32} className="text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">ExpenseTracker</h1>
                <p className="text-gray-400 text-sm">Financial Dashboard</p>
            </div>
        </div>
        <Link to="/" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition text-sm">
            <Home size={16} /> Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STATS & FORMS */}
        <div className="space-y-6">
            
            {/* 1. TOTAL CARD (UPDATED WITH FILTER LOGIC) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-blue-100 text-sm font-medium mb-1">
                        {filterCategory === 'All' ? 'Total Spent' : `Spent on ${filterCategory}`}
                    </p>
                    <Filter size={16} className="text-blue-300"/>
                </div>
                <h2 className="text-4xl font-bold text-white">${totalSpent}</h2>
                <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">{filteredExpenses.length} Transactions</span>
                </div>
            </div>

            {/* 2. ADD CATEGORY */}
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Tag size={18} className="text-blue-400"/> New Category</h3>
                <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input className="flex-1 bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="e.g. Food, Travel" value={catName} onChange={e=>setCatName(e.target.value)} required />
                    <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded transition"><Plus size={20}/></button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map(c => (
                        <span key={c.id} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">{c.name}</span>
                    ))}
                </div>
            </div>

            {/* 3. ADD EXPENSE */}
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><PieChart size={18} className="text-green-400"/> Add Expense</h3>
                <form onSubmit={handleAddExpense} className="space-y-3">
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none" 
                        placeholder="Expense Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                    
                    <div className="flex gap-2">
                        <input type="number" step="0.01" className="w-1/2 bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none" 
                            placeholder="Amount ($)" value={amount} onChange={e=>setAmount(e.target.value)} required />
                        
                        <select className="w-1/2 bg-gray-700 border-none rounded p-2 text-white outline-none" 
                            value={catId} onChange={e=>setCatId(e.target.value)} required>
                            <option value="">Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold transition">Add Transaction</button>
                </form>
            </div>
        </div>

        {/* RIGHT COLUMN: LIST & FILTER */}
        <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-full">
                
                {/* NEW: FILTER DROPDOWN */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">Recent Transactions</h3>
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="All">Show All</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                
                {filteredExpenses.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No expenses found for this category.</div>
                ) : (
                    <div className="space-y-3">
                        {filteredExpenses.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-xl hover:bg-gray-700 transition group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-600 p-3 rounded-full">
                                        <DollarSign size={20} className="text-gray-300"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{item.title}</h4>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <span className="bg-gray-600 px-2 py-0.5 rounded text-xs">{item.category_name}</span>
                                            <span className="flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-red-400 text-lg">-${item.amount}</span>
                                    <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  )
}

export default ExpenseProject