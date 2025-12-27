import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Search, AlertTriangle, CheckCircle, Truck, Plus, Home, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function InventoryProject() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  // Forms
  const [supName, setSupName] = useState('')
  const [supEmail, setSupEmail] = useState('')
  const [supPhone, setSupPhone] = useState('')
  
  const [prodName, setProdName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [supId, setSupId] = useState('')

  useEffect(() => { 
    refreshData() 
  }, [])

  // SEARCH LOGIC: Triggers whenever searchQuery changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Calls API with ?search=query
      axios.get(`http://127.0.0.1:8000/api/products/?search=${searchQuery}`)
        .then(res => setProducts(res.data))
    }, 300) // Small delay to prevent too many requests
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/suppliers/').then(res => setSuppliers(res.data))
    // Initial load gets all products
    if(searchQuery === '') axios.get('http://127.0.0.1:8000/api/products/').then(res => setProducts(res.data))
  }

  const handleAddSupplier = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/suppliers/', { name: supName, email: supEmail, phone: supPhone })
      .then(() => { refreshData(); setSupName(''); setSupEmail(''); setSupPhone('') })
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/products/', { 
        name: prodName, sku, price, quantity: qty, supplier: supId 
    }).then(() => {
        refreshData()
        setProdName(''); setSku(''); setPrice(''); setQty('');
    })
  }

  const handleDelete = (id) => {
    if(confirm("Delete item?")) axios.delete(`http://127.0.0.1:8000/api/products/${id}/`).then(refreshData)
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100 p-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Box className="text-yellow-500"/> Warehouse Inventory
            </h1>
            <p className="text-gray-400">Stock Management System</p>
        </div>
        <Link to="/" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition">
            <Home size={18}/> Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT: FORMS */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* SUPPLIER FORM */}
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-500"><Truck size={18}/> New Supplier</h3>
                <form onSubmit={handleAddSupplier} className="space-y-3">
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500" 
                        placeholder="Company Name" value={supName} onChange={e=>setSupName(e.target.value)} required />
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400" 
                        placeholder="Email" value={supEmail} onChange={e=>setSupEmail(e.target.value)} required />
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400" 
                        placeholder="Phone" value={supPhone} onChange={e=>setSupPhone(e.target.value)} required />
                    <button className="w-full bg-yellow-600 text-black font-bold py-2 rounded hover:bg-yellow-500">Add Supplier</button>
                </form>
            </div>

            {/* PRODUCT FORM */}
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><Plus size={18}/> Add Stock</h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
                        placeholder="Product Name" value={prodName} onChange={e=>setProdName(e.target.value)} required />
                    <input className="w-full bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400" 
                        placeholder="SKU (Code)" value={sku} onChange={e=>setSku(e.target.value)} required />
                    <div className="flex gap-2">
                        <input type="number" className="w-1/2 bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400" 
                            placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} required />
                        <input type="number" className="w-1/2 bg-gray-700 border-none rounded p-2 text-white placeholder-gray-400" 
                            placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)} required />
                    </div>
                    <select className="w-full bg-gray-700 border-none rounded p-2 text-white" value={supId} onChange={e=>setSupId(e.target.value)} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500">Receive Stock</button>
                </form>
            </div>
        </div>

        {/* RIGHT: INVENTORY LIST */}
        <div className="lg:col-span-3">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 min-h-[500px]">
                
                {/* SEARCH BAR */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Current Stock</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Name or SKU..." 
                            className="bg-gray-900 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                            <tr>
                                <th className="p-4 rounded-l-lg">Product</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status / Qty</th>
                                <th className="p-4 rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {products.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr> : 
                             products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4 font-bold text-white">{p.name}</td>
                                    <td className="p-4 font-mono text-sm">{p.sku}</td>
                                    <td className="p-4 text-sm">{p.supplier_name}</td>
                                    <td className="p-4">${p.price}</td>
                                    <td className="p-4">
                                        {/* LOW STOCK LOGIC */}
                                        {p.is_low_stock ? (
                                            <span className="inline-flex items-center gap-1 bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-700 animate-pulse">
                                                <AlertTriangle size={12}/> Low Stock: {p.quantity}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-700">
                                                <CheckCircle size={12}/> In Stock: {p.quantity}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-500 transition">
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

      </div>
    </div>
  )
}

export default InventoryProject