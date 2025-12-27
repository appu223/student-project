import { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, MessageSquare, Send, Trash2, Home, Edit3, Globe, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

function BlogProject() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  
  // Post Form Data
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Comment Form Data
  const [commentName, setCommentName] = useState('')
  const [commentBody, setCommentBody] = useState('')

  useEffect(() => { refreshPosts() }, [])

  const refreshPosts = () => {
    axios.get('http://127.0.0.1:8000/api/posts/')
      .then(res => {
        setPosts(res.data)
        // If we are viewing a post, refresh that specific post too to see new comments
        if (selectedPost) {
            const updated = res.data.find(p => p.id === selectedPost.id)
            setSelectedPost(updated)
        }
      })
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/posts/', { title, content, is_published: isPublished })
      .then(() => {
        refreshPosts()
        setTitle(''); setContent(''); setShowForm(false)
      })
  }

  const handleDeletePost = (e, id) => {
    e.stopPropagation() // Prevent clicking the card when deleting
    if(confirm("Delete this post?")) {
        axios.delete(`http://127.0.0.1:8000/api/posts/${id}/`).then(() => {
            refreshPosts()
            setSelectedPost(null)
        })
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/comments/', {
        post: selectedPost.id,
        name: commentName,
        body: commentBody
    }).then(() => {
        refreshPosts()
        setCommentName(''); setCommentBody('')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-white"><FileText size={24}/></div>
            <h1 className="text-2xl font-bold tracking-tight">DevBlog CMS</h1>
        </div>
        <div className="flex gap-3">
             <button onClick={() => setShowForm(!showForm)} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition flex items-center gap-2">
                <Edit3 size={16}/> {showForm ? "Cancel" : "Write Post"}
             </button>
             <Link to="/" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition flex items-center gap-2">
                <Home size={16}/>
             </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR: POST LIST */}
        <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
            
            {showForm && (
                <div className="p-6 bg-orange-50 border-b border-orange-100">
                    <h3 className="font-bold mb-3">New Article</h3>
                    <form onSubmit={handleCreatePost} className="space-y-3">
                        <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                        <textarea className="w-full p-2 border rounded h-24" placeholder="Write your content here..." value={content} onChange={e=>setContent(e.target.value)} required />
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} id="pub" />
                            <label htmlFor="pub" className="text-sm">Publish immediately?</label>
                        </div>
                        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 font-bold">Save Post</button>
                    </form>
                </div>
            )}

            <div className="p-4 space-y-2">
                {posts.map(post => (
                    <div key={post.id} onClick={() => setSelectedPost(post)} 
                        className={`p-4 rounded-xl cursor-pointer transition border hover:shadow-md group relative
                        ${selectedPost?.id === post.id ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
                        
                        <div className="flex justify-between items-start">
                            <h3 className={`font-bold text-lg ${!post.is_published && 'text-gray-400'}`}>{post.title}</h3>
                            {post.is_published ? <Globe size={14} className="text-green-500"/> : <Lock size={14} className="text-gray-400"/>}
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-1">/{post.slug}</p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.content}</p>
                        
                        <button onClick={(e) => handleDeletePost(e, post.id)} 
                            className="absolute bottom-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT MAIN: READER VIEW */}
        <div className="w-2/3 bg-gray-50 overflow-y-auto p-10">
            {selectedPost ? (
                <div className="max-w-3xl mx-auto">
                    {/* POST CONTENT */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${selectedPost.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {selectedPost.is_published ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-gray-400 text-sm">{new Date(selectedPost.created_at).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{selectedPost.title}</h1>
                        <div className="prose prose-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {selectedPost.content}
                        </div>
                    </div>

                    {/* COMMENTS SECTION */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare size={20}/> Comments ({selectedPost.comments.length})
                        </h3>
                        
                        <div className="space-y-6 mb-8">
                            {selectedPost.comments.length === 0 ? <p className="text-gray-400 italic">No comments yet. Be the first!</p> :
                             selectedPost.comments.map(c => (
                                <div key={c.id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800">{c.name}</span>
                                            <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1">{c.body}</p>
                                    </div>
                                </div>
                             ))
                            }
                        </div>

                        {/* ADD COMMENT FORM */}
                        <form onSubmit={handleAddComment} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Leave a Reply</h4>
                            <div className="flex gap-3 mb-3">
                                <input className="w-1/3 p-2 border rounded focus:outline-none focus:border-orange-500" placeholder="Your Name" 
                                    value={commentName} onChange={e=>setCommentName(e.target.value)} required />
                                <input className="flex-1 p-2 border rounded focus:outline-none focus:border-orange-500" placeholder="Your Comment..." 
                                    value={commentBody} onChange={e=>setCommentBody(e.target.value)} required />
                            </div>
                            <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black transition flex items-center gap-2 text-sm">
                                <Send size={14}/> Post Comment
                            </button>
                        </form>
                    </div>

                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText size={64} className="mb-4 opacity-20"/>
                    <p className="text-lg">Select an article from the left to read</p>
                </div>
            )}
        </div>

      </div>
    </div>
  )
}

export default BlogProject