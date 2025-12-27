import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  CheckCircle2, Trophy, Home, Play, Plus, Trash2, 
  Edit3, X, Zap, BrainCircuit, LayoutDashboard, Save, ArrowRight, User, BarChart3, Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'

function QuizProject() {
  const [quizzes, setQuizzes] = useState([])
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers] = useState({}) 
  const [result, setResult] = useState(null)
  const [isTeacherMode, setIsTeacherMode] = useState(false) 
  
  // NEW: Store Student Name
  const [studentName, setStudentName] = useState('')

  // CREATION STATES
  const [newQuizTitle, setNewQuizTitle] = useState('')
  const [newQuizDesc, setNewQuizDesc] = useState('')
  const [editingQuiz, setEditingQuiz] = useState(null) 
  
  // TEACHER TABS (Editor vs Results)
  const [teacherTab, setTeacherTab] = useState('editor') // 'editor' or 'results'
  const [quizResults, setQuizResults] = useState([]) // Store list of results

  // QUESTION STATES
  const [qText, setQText] = useState('')
  const [opt1, setOpt1] = useState(''); const [isCorrect1, setIs1] = useState(false)
  const [opt2, setOpt2] = useState(''); const [isCorrect2, setIs2] = useState(false)
  const [opt3, setOpt3] = useState(''); const [isCorrect3, setIs3] = useState(false)

  useEffect(() => { refreshData() }, [])

  const refreshData = () => {
    axios.get('http://127.0.0.1:8000/api/quizzes/').then(res => setQuizzes(res.data))
  }

  // --- STUDENT LOGIC ---
  const handleSelectOption = (qId, oId) => setAnswers({ ...answers, [qId]: oId })
  
  const handleSubmit = () => {
    if(!activeQuiz) return
    if(!studentName) { alert("Please enter your name!"); return }

    axios.post(`http://127.0.0.1:8000/api/quizzes/${activeQuiz.id}/submit/`, { 
        answers, 
        student_name: studentName // Send Name to Backend
    }).then(res => setResult(res.data))
  }
  
  const resetQuiz = () => { setActiveQuiz(null); setAnswers({}); setResult(null); setStudentName('') }

  // --- TEACHER LOGIC ---
  const fetchResults = (quizId) => {
    // Filter results for this specific quiz
    axios.get('http://127.0.0.1:8000/api/results/').then(res => {
        const filtered = res.data.filter(r => r.quiz === quizId)
        setQuizResults(filtered)
    })
  }

  const handleEditClick = (quiz) => {
    setEditingQuiz(quiz)
    setTeacherTab('editor') // Default to editor
    fetchResults(quiz.id)   // Load results in background
  }

  const createQuiz = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/quizzes/', { title: newQuizTitle, description: newQuizDesc })
      .then(res => {
        refreshData(); setEditingQuiz(res.data); setNewQuizTitle(''); setNewQuizDesc('')
      })
  }

  const deleteQuiz = (id, e) => {
    e.stopPropagation()
    if(confirm("Delete this quiz?")) axios.delete(`http://127.0.0.1:8000/api/quizzes/${id}/`).then(refreshData)
  }

  const addQuestion = (e) => {
    e.preventDefault()
    if (!qText || !opt1 || !opt2) { alert("Please fill details"); return }
    if (!isCorrect1 && !isCorrect2 && !isCorrect3) { alert("Mark a correct answer"); return }

    axios.post('http://127.0.0.1:8000/api/questions/', { quiz: editingQuiz.id, text: qText })
      .then(res => {
        const qId = res.data.id
        const opts = [
            { text: opt1, is_correct: isCorrect1, question: qId },
            { text: opt2, is_correct: isCorrect2, question: qId },
            { text: opt3, is_correct: isCorrect3, question: qId },
        ].filter(o => o.text)

        Promise.all(opts.map(o => axios.post('http://127.0.0.1:8000/api/options/', o)))
          .then(() => {
            alert("Question Added!")
            setQText(''); setOpt1(''); setOpt2(''); setOpt3(''); setIs1(false); setIs2(false); setIs3(false)
            axios.get(`http://127.0.0.1:8000/api/quizzes/${editingQuiz.id}/`).then(res => setEditingQuiz(res.data))
          })
      })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-indigo-100">
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                    <BrainCircuit size={24} strokeWidth={2.5}/>
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">QuizGenius</h1>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Learning Platform</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-1 rounded-full flex relative">
                    <button onClick={() => setIsTeacherMode(false)} className={`relative z-10 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${!isTeacherMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Student</button>
                    <button onClick={() => setIsTeacherMode(true)} className={`relative z-10 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isTeacherMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Teacher</button>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <Link to="/" className="text-slate-400 hover:text-indigo-600 transition"><Home size={20}/></Link>
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= TEACHER MODE ================= */}
        {isTeacherMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                
                {/* LEFT: QUIZ LIST */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Creator Studio</h2>
                            <p className="text-indigo-200 text-sm mb-6">Build challenges for your students.</p>
                            <form onSubmit={createQuiz} className="space-y-3">
                                <input className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-indigo-300 focus:outline-none focus:bg-white/20 transition" 
                                    placeholder="Quiz Title" value={newQuizTitle} onChange={e=>setNewQuizTitle(e.target.value)} required />
                                <input className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-indigo-300 focus:outline-none focus:bg-white/20 transition" 
                                    placeholder="Description" value={newQuizDesc} onChange={e=>setNewQuizDesc(e.target.value)} required />
                                <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition flex justify-center items-center gap-2">
                                    <Plus size={18}/> Create Quiz
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider px-2">Your Library</h3>
                        {quizzes.map(quiz => (
                            <div key={quiz.id} onClick={() => handleEditClick(quiz)} 
                                className={`p-4 rounded-xl cursor-pointer transition-all border flex justify-between items-center group
                                ${editingQuiz?.id === quiz.id ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                                <div>
                                    <h4 className="font-bold text-slate-800">{quiz.title}</h4>
                                    <p className="text-xs text-slate-400">{quiz.questions?.length || 0} Questions</p>
                                </div>
                                <button onClick={(e) => deleteQuiz(quiz.id, e)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: EDITOR / RESULTS */}
                <div className="lg:col-span-8">
                    {editingQuiz ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-full">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Edit3 size={24} className="text-indigo-500"/> {editingQuiz.title}
                                </h2>
                                {/* TAB SWITCHER */}
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button onClick={() => setTeacherTab('editor')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${teacherTab==='editor' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Edit Questions</button>
                                    <button onClick={() => setTeacherTab('results')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${teacherTab==='results' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>View Results</button>
                                </div>
                            </div>

                            {/* TAB 1: EDIT QUESTIONS */}
                            {teacherTab === 'editor' && (
                                <form onSubmit={addQuestion} className="space-y-6 max-w-2xl mx-auto animate-fade-in">
                                    <p className="text-slate-500 mb-4">Add new questions below.</p>
                                    <input className="w-full text-lg font-bold p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" 
                                        placeholder="Question Text?" value={qText} onChange={e=>setQText(e.target.value)} required />
                                    
                                    <div className="space-y-3">
                                        {[
                                            { val: opt1, set: setOpt1, cor: isCorrect1, setCor: setIs1, ph: "Option A" },
                                            { val: opt2, set: setOpt2, cor: isCorrect2, setCor: setIs2, ph: "Option B" },
                                            { val: opt3, set: setOpt3, cor: isCorrect3, setCor: setIs3, ph: "Option C" }
                                        ].map((opt, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${opt.cor ? 'border-green-500 bg-green-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                                                <button type="button" onClick={() => opt.setCor(!opt.cor)} 
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${opt.cor ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}>
                                                    <CheckCircle2 size={20}/>
                                                </button>
                                                <input className="flex-1 bg-transparent outline-none font-medium text-slate-700 placeholder-slate-400" 
                                                    placeholder={opt.ph} value={opt.val} onChange={e=>opt.set(e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex justify-center items-center gap-2">
                                        <Save size={20}/> Save Question
                                    </button>
                                </form>
                            )}

                            {/* TAB 2: VIEW RESULTS */}
                            {teacherTab === 'results' && (
                                <div className="animate-fade-in">
                                    {quizResults.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                                            <BarChart3 size={48} className="mb-2 opacity-50"/>
                                            <p>No students have taken this quiz yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-slate-600">
                                                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="p-4 rounded-l-xl">Student Name</th>
                                                        <th className="p-4">Score</th>
                                                        <th className="p-4">Performance</th>
                                                        <th className="p-4 rounded-r-xl">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {quizResults.map(res => (
                                                        <tr key={res.id} className="hover:bg-indigo-50/50 transition">
                                                            <td className="p-4 font-bold text-slate-800">{res.student_name}</td>
                                                            <td className="p-4 font-mono">{res.score} / {res.total_questions}</td>
                                                            <td className="p-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    (res.score/res.total_questions) >= 0.5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                    {Math.round((res.score/res.total_questions)*100)}%
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-xs text-slate-400">
                                                                {new Date(res.submitted_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl min-h-[400px]">
                            <LayoutDashboard size={64} className="mb-4 text-slate-200"/>
                            <p className="text-lg font-medium">Select a quiz to manage</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            
        /* ================= STUDENT MODE ================= */
            <div className="max-w-5xl mx-auto">
                 {!activeQuiz ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {quizzes.length === 0 ? <div className="col-span-full text-center py-20 text-slate-400">No active quizzes. Ask your teacher to add one!</div> :
                         quizzes.map(quiz => (
                            <div key={quiz.id} className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                                        <Zap size={24} fill="currentColor"/>
                                    </div>
                                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">{quiz.title}</h2>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{quiz.description}</p>
                                    <button onClick={() => setActiveQuiz(quiz)} className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2">
                                        Start Challenge <ArrowRight size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : !result ? (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-4xl mx-auto border border-slate-100 animate-slide-up">
                        <div className="bg-slate-900 text-white p-10 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{activeQuiz.title}</h2>
                                <p className="text-slate-400 text-sm">Please enter your name to begin.</p>
                            </div>
                            <button onClick={resetQuiz} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><X/></button>
                        </div>

                        <div className="p-10 space-y-12">
                            {/* NAME INPUT */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-2">
                                    <User size={16}/> Student Name
                                </label>
                                <input className="w-full p-3 text-lg font-bold bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your name..." value={studentName} onChange={e=>setStudentName(e.target.value)} autoFocus />
                            </div>

                            {activeQuiz.questions.map((q, i) => (
                                <div key={q.id} className="animate-fade-in" style={{animationDelay: `${i*0.1}s`}}>
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex gap-4">
                                        <span className="flex-none w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">{i+1}</span>
                                        {q.text}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                                        {q.options.map(opt => (
                                            <div key={opt.id} onClick={() => handleSelectOption(q.id, opt.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 group
                                                ${answers[q.id]===opt.id ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition
                                                    ${answers[q.id]===opt.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-300'}`}>
                                                    {answers[q.id]===opt.id && <div className="w-2 h-2 bg-white rounded-full"/>}
                                                </div>
                                                <span className={`font-semibold ${answers[q.id]===opt.id ? 'text-indigo-900' : 'text-slate-600'}`}>{opt.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-10 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={handleSubmit} className="bg-indigo-600 text-white font-bold py-4 px-12 rounded-2xl hover:bg-indigo-700 hover:scale-105 transition shadow-xl shadow-indigo-200">
                                Submit All Answers
                            </button>
                        </div>
                    </div>
                 ) : (
                    <div className="text-center max-w-lg mx-auto mt-10 animate-bounce-in">
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500"></div>
                            
                            <div className="inline-block p-6 bg-yellow-50 rounded-full mb-6">
                                <Trophy size={64} className="text-yellow-500 fill-yellow-500 animate-pulse"/>
                            </div>
                            
                            <h2 className="text-5xl font-extrabold text-slate-900 mb-2">{result.score} <span className="text-2xl text-slate-400 font-medium">/ {result.total}</span></h2>
                            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-10">Final Score</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-slate-400 text-xs font-bold uppercase">Accuracy</p>
                                    <p className="text-2xl font-bold text-slate-800">{Math.round(result.percentage)}%</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-slate-400 text-xs font-bold uppercase">Status</p>
                                    <p className={`text-2xl font-bold ${result.percentage >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.percentage >= 50 ? 'Passed' : 'Failed'}
                                    </p>
                                </div>
                            </div>

                            <button onClick={resetQuiz} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition">
                                Try Another Challenge
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        )}

      </div>
    </div>
  )
}

export default QuizProject