import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActive } from './features/pollSlice';
import { setStudentsList, setUser, clearUser } from './features/studentSlice';
import { socket } from './hooks/useSocket';
import {
  Sparkles,
  ChevronDown,
  Plus,
  MessageSquare,
  Send,
  Clock,
  User,
  Users
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  PollOption,
  StudentListItem,
  LivePollResults,
  AlertBox
} from './components';

const ChatWidget = ({ role, name, students, onKickStudent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => socket.off('receive_message');
  }, []);

  const send = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const messageData = {
      text: msg,
      sender: name || 'Teacher',
      role,
      id: Date.now()
    };
    socket.emit('send_message', messageData);
    setMsg('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="mb-2 w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in">
          {/* Header Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTab === 'chat' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Chat
              {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B4EF0] mx-8 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTab === 'participants' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Participants
              {activeTab === 'participants' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B4EF0] mx-8 rounded-t-full" />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white p-4">
            {activeTab === 'chat' ? (
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.sender === name ? 'items-end' : 'items-start'}`}>
                    <span className={`text-xs font-bold mb-1 ${m.sender === name ? 'text-[#5B4EF0]' : 'text-gray-500'}`}>
                      {m.sender}
                    </span>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[85%] ${m.sender === name
                      ? 'bg-[#5B4EF0] text-white rounded-tr-none'
                      : 'bg-[#333333] text-white rounded-tl-none'
                      }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 font-medium px-2 mb-2 uppercase tracking-wide">
                  <span>Name</span>
                  <span>Action</span>
                </div>
                {students && students.map(s => (
                  <StudentListItem
                    key={s.id}
                    name={s.name}
                    onKick={role === 'teacher' ? () => onKickStudent(s.id) : null}
                  />
                ))}
              </div>
            )}
          </div>

          {activeTab === 'chat' && (
            <form onSubmit={send} className="p-4 border-t border-gray-100 bg-white">
              <div className="relative">
                <input
                  className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5B4EF0] transition-all"
                  placeholder="Type a message..."
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#5B4EF0] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#5B4EF0] text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center hover:scale-105 transition-all active:scale-95"
      >
        <MessageSquare size={28} />
      </button>
    </div>
  );
};

const CreatePollForm = ({ onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [options, setOptions] = useState([
    { text: 'Rahul Bajaj', isCorrect: true },
    { text: 'Rahul Bajaj', isCorrect: false }
  ]);

  const handleCreate = () => {
    const validOptions = options.filter(o => o.text.trim() !== '');
    if (!question.trim() || validOptions.length < 2) {
      alert("Please enter a question and at least two valid options.");
      return;
    }
    onCreatePoll({
      question,
      options: options.map(o => o.text),
      timeLimit
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const toggleCorrect = (index, isCorrect) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  return (
    <div className="max-w-5xl mx-auto w-full bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-gray-100 relative min-h-[600px] animate-in">
      <div className="inline-flex items-center gap-2 bg-[#5B4EF0] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
        <Sparkles size={16} fill="currentColor" />
        <span>Intervue Poll</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Let’s <span className="relative">Get Started</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
          You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xl font-bold text-gray-900">Enter your question</label>
          <div className="relative">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="appearance-none bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 pl-4 pr-10 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-[#5B4EF0] transition-all"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>2 minutes</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => e.target.value.length <= 100 && setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full bg-gray-100 text-gray-900 text-lg p-6 rounded-xl outline-none focus:ring-2 focus:ring-[#5B4EF0] transition-all resize-none h-40 placeholder:text-gray-400 font-medium"
          />
          <span className="absolute bottom-4 right-4 text-sm font-bold text-gray-400">
            {question.length}/100
          </span>
        </div>
      </div>

      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-3">
          <div className="md:col-span-8 text-lg font-bold text-gray-900">Edit Options</div>
          <div className="md:col-span-4 text-lg font-bold text-gray-900 hidden md:block">Is it Correct?</div>
        </div>

        <div className="space-y-4">
          {options.map((opt, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
              <div className="md:col-span-8 flex items-center gap-4 bg-gray-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-[#5B4EF0] transition-all">
                <div className="w-8 h-8 flex-shrink-0 bg-[#5B4EF0] text-white rounded-full flex items-center justify-center font-bold text-sm ml-2">
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full bg-transparent border-none outline-none text-gray-800 font-bold h-10 px-2"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-6 px-2">
                <span className="md:hidden font-bold text-gray-500 mr-2">Correct?</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'border-[#5B4EF0]' : 'border-gray-300 group-hover:border-[#5B4EF0]'}`}>
                    {opt.isCorrect && <div className="w-3 h-3 bg-[#5B4EF0] rounded-full" />}
                  </div>
                  <input type="radio" name={`correct-${i}`} checked={opt.isCorrect} onChange={() => toggleCorrect(i, true)} className="hidden" />
                  <span className="font-bold text-gray-900">Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${!opt.isCorrect ? 'border-[#5B4EF0]' : 'border-gray-300 group-hover:border-[#5B4EF0]'}`}>
                    {!opt.isCorrect && <div className="w-3 h-3 bg-[#5B4EF0] rounded-full" />}
                  </div>
                  <input type="radio" name={`correct-${i}`} checked={!opt.isCorrect} onChange={() => toggleCorrect(i, false)} className="hidden" />
                  <span className="font-bold text-gray-900">No</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addOption}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#5B4EF0] text-[#5B4EF0] font-bold hover:bg-[#5B4EF0] hover:text-white transition-all"
        >
          <Plus size={20} />
          Add More option
        </button>
      </div>

      <div className="absolute bottom-8 right-8">
        <Button
          onClick={handleCreate}
          size="lg"
          className="shadow-2xl shadow-indigo-300 hover:-translate-y-1"
        >
          Ask Question
        </Button>
      </div>
    </div>
  );
};

const StudentWaitingView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Wait for the teacher to ask a new question..</h2>
      </div>
    </div>
  );
};

const StudentPollView = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poll?.timeLimit || 60);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || hasVoted) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, hasVoted]);

  const handleSubmit = () => {
    if (selectedOption === null || hasVoted) return;
    socket.emit('student_answer', { pollId: poll._id, optionIndex: selectedOption });
    setHasVoted(true);
  };

  const totalVotes = poll.totalVotes || 0;

  return (
    <div className="max-w-4xl mx-auto w-full pt-10 px-4 animate-in">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Question 1</h2>
        <div className={`flex items-center gap-1 font-bold text-lg ${timeLeft < 10 ? 'text-red-500' : 'text-red-600'}`}>
          <Clock size={20} />
          <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#595959] p-6">
          <h3 className="text-white text-xl font-medium">{poll.question}</h3>
        </div>

        <div className="p-8 space-y-4">
          {poll.options.map((opt, i) => {
            const pct = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;

            if (hasVoted) {
              return (
                <PollOption
                  key={i}
                  index={i}
                  text={opt.text}
                  votes={opt.votes}
                  percentage={pct}
                  showVotes={false} // Screenshot doesn't show explicit % text, just bar? Or maybe it does. Let's assume bar is enough or check screenshot.
                  // Screenshot shows bar filling up.
                  isSelected={selectedOption === i}
                />
              );
            }

            return (
              <div
                key={i}
                onClick={() => !hasVoted && setSelectedOption(i)}
                className={`
                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedOption === i ? 'border-[#5B4EF0] bg-indigo-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}
              `}
              >
                <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${selectedOption === i ? 'bg-[#5B4EF0] text-white' : 'bg-[#A3A3A3] text-white'}
              `}>
                  {i + 1}
                </div>
                <span className="font-semibold text-lg text-gray-700">{opt.text}</span>
              </div>
            )
          })}
        </div>

        {!hasVoted && (
          <div className="p-6 border-t border-gray-100 flex justify-end items-center gap-4">
            <Button onClick={handleSubmit} disabled={selectedOption === null} size="lg" className="w-40 rounded-full">
              Submit
            </Button>
          </div>
        )}
      </div>

      {hasVoted && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Wait for the teacher to ask a new question..</h3>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN SCREENS                                */
/* -------------------------------------------------------------------------- */

/**
 * Login / Role Selection Screen
 * Matches Screenshot 2025-12-03 at 9.38.49 AM.png & Name Input
 */
const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState('role'); // 'role' | 'name'
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');

  const handleRoleSelect = (r) => {
    setRole(r);
  };

  const handleContinue = () => {
    if (step === 'role' && role) {
      setStep('name');
    } else if (step === 'name' && name.trim()) {
      onLogin({ role: role, name });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {step === 'role' && (
        <div className="w-full max-w-5xl text-center animate-in">
          <div className="inline-flex items-center gap-2 bg-[#5B4EF0] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Sparkles size={16} fill="currentColor" />
            <span>Intervue Poll</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to the <span className="font-extrabold">Live Polling System</span></h1>
          <p className="text-gray-500 text-lg mb-12">Please select the role that best describes you to begin using the live polling system</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div
              onClick={() => handleRoleSelect('student')}
              className={`text-left p-8 rounded-2xl border-2 cursor-pointer transition-all h-48 flex flex-col justify-center
                ${role === 'student' ? 'border-[#5B4EF0] ring-4 ring-indigo-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Student</h3>
              <p className="text-gray-500 font-medium">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
            </div>

            <div
              onClick={() => handleRoleSelect('teacher')}
              className={`text-left p-8 rounded-2xl border-2 cursor-pointer transition-all h-48 flex flex-col justify-center
                ${role === 'teacher' ? 'border-[#5B4EF0] ring-4 ring-indigo-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Teacher</h3>
              <p className="text-gray-500 font-medium">Submit answers and view live poll results in real-time.</p>
            </div>
          </div>

          <Button onClick={handleContinue} disabled={!role} className="w-64 rounded-full text-lg py-4 shadow-xl shadow-indigo-200">
            Continue
          </Button>
        </div>
      )}

      {step === 'name' && (
        <div className="w-full max-w-4xl text-center animate-in">
          <div className="inline-flex items-center gap-2 bg-[#5B4EF0] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Sparkles size={16} fill="currentColor" />
            <span>Intervue Poll</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">Let's <span className="font-extrabold">Get Started</span></h1>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
            {role === 'teacher'
              ? "Enter your unique teacher ID to create polls and manage your class sessions"
              : "If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates"
            }
          </p>

          <div className="max-w-md mx-auto mb-12 text-left">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              {role === 'teacher' ? 'Enter your Teacher ID' : 'Enter your Name'}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 text-lg px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#5B4EF0]"
              placeholder={role === 'teacher' ? 'e.g., Mr.Singh' : 'e.g., Rahul'}
            />
          </div>

          <Button onClick={handleContinue} disabled={!name} className="w-64 rounded-full text-lg py-4 shadow-xl shadow-indigo-200">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Teacher: Past Polls View
 */
const PastPollsView = ({ teacherName }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5020';
        const res = await fetch(`${API_URL}/api/polls?teacherName=${encodeURIComponent(teacherName)}`);
        const data = await res.json();
        setPolls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [teacherName]);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">View <span className="font-extrabold">Poll History</span></h2>
      <div className="space-y-12">
        {polls.map((poll, index) => (
          <div key={poll._id} className="w-full">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Question {polls.length - index}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="bg-[#595959] p-4 px-6">
                <h3 className="text-white text-lg font-medium">{poll.question}</h3>
              </div>
              <div className="p-6 space-y-3">
                {poll.options.map((opt, i) => {
                  const pct = poll.totalVotes ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  return (
                    <PollOption
                      key={i}
                      index={i}
                      text={opt.text}
                      votes={opt.votes}
                      percentage={pct}
                      showVotes={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {polls.length === 0 && <div className="text-center text-gray-500">No past polls found.</div>}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN APP                                    */
/* -------------------------------------------------------------------------- */

export default function App() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null); // { name, role }
  const [activePoll, setActivePoll] = useState(null);
  const [students, setStudents] = useState([]);
  const [kicked, setKicked] = useState(false);
  const [showPastPolls, setShowPastPolls] = useState(false);

  // Socket Logic
  useEffect(() => {
    if (!userData) return;

    if (userData.role === 'student') {
      socket.emit('student_join', { name: userData.name });
    }

    socket.emit('request_active_poll');

    socket.on('update_results', (poll) => {
      setActivePoll(poll);
      dispatch(setActive(poll));
    });

    // socket.on('poll_end', () => setActivePoll(null)); // Removed to allow viewing results after end

    socket.on('update_students', (list) => {
      setStudents(list);
      dispatch(setStudentsList(list));
    });

    socket.on('kicked', () => {
      setKicked(true);
      setUserData(null);
    });

    return () => {
      socket.off('update_results');
      socket.off('poll_end');
      socket.off('update_students');
      socket.off('kicked');
    };
  }, [userData, dispatch]);

  const handleLogin = (data) => {
    setUserData(data);
    dispatch(setUser(data));
  };

  const handleCreatePoll = (data) => {
    const pollData = {
      ...data,
      teacherName: userData.name
    };
    console.log('Creating poll with:', pollData);
    socket.emit('teacher_create_poll', pollData, (res) => {
      if (res?.error) alert(res.error);
      else console.log('Poll created successfully:', res);
    });
  };

  const handleEndPoll = () => {
    if (activePoll) {
      socket.emit('poll_end', { pollId: activePoll._id });
    }
  };

  const handleKickStudent = (studentId) => {
    if (confirm("Kick this student?")) {
      socket.emit('kick_student', studentId);
    }
  };

  // Renders

  if (kicked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center animate-in">
        <div className="inline-flex items-center gap-2 bg-[#5B4EF0] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
          <Sparkles size={16} fill="currentColor" />
          <span>Intervue Poll</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">You’ve been Kicked out !</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">Looks like the teacher has removed you from the poll system. Please try again sometime.</p>
      </div>
    );
  }

  if (!userData) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Teacher View */}
      {userData.role === 'teacher' && (
        <div className="p-6 md:p-12">
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowPastPolls(!showPastPolls)} className="bg-gray-800 hover:bg-gray-900 text-white rounded-full px-6">
              {showPastPolls ? 'Back to Live' : 'View Past Polls'}
            </Button>
          </div>

          {showPastPolls ? (
            <PastPollsView teacherName={userData.name} />
          ) : (
            !activePoll ? (
              <CreatePollForm onCreatePoll={handleCreatePoll} />
            ) : (
              <LivePollResults
                poll={activePoll}
                onEndPoll={handleEndPoll}
                onNewQuestion={() => setActivePoll(null)} // Logic: Clear active poll to show create form
                isTeacher={true}
              />
            )
          )}
        </div>
      )}

      {/* Student View */}
      {userData.role === 'student' && (
        <div className="h-screen flex flex-col">
          {!activePoll ? (
            <StudentWaitingView />
          ) : activePoll.isActive ? (
            <StudentPollView poll={activePoll} />
          ) : (
            <LivePollResults poll={activePoll} isTeacher={false} />
          )}
        </div>
      )}

      <ChatWidget
        role={userData.role}
        name={userData.name}
        students={students}
        onKickStudent={handleKickStudent}
      />
    </div>
  );
}