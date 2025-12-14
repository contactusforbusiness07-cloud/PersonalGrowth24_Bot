import React, { useState, useEffect } from 'react';
import { Home, Trophy, CheckCircle, Wallet, Lock, Share2, ExternalLink } from 'lucide-react';

const API_URL = "/api"; // Auto-connect to backend

export default function App() {
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake ID for testing in browser (Telegram me real ID aayegi)
  const tg = window.Telegram?.WebApp;
  const userId = tg?.initDataUnsafe?.user?.id || "123456";

  useEffect(() => {
    if(tg) tg.ready();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/${userId}`);
      const data = await res.json();
      setUser(data);
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  };

  const handleTask = async (reward) => {
    // Real logic: Server par paise add karo
    await fetch(`${API_URL}/reward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount: reward, type: 'task' })
    });
    fetchUser(); // Balance update karo
    alert(`🎉 +${reward} Coins Added!`);
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-24">
      
      {/* --- HEADER --- */}
      <div className="bg-slate-800 p-4 sticky top-0 z-20 shadow-md flex justify-between items-center border-b border-slate-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">ProEarner</h1>
        <div className="bg-slate-700 px-4 py-1 rounded-full text-sm font-bold text-yellow-400 border border-yellow-500/30">
          🪙 {user?.walletBalance || 0}
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* --- HOME SECTION --- */}
        {tab === 'home' && (
          <>
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 bg-yellow-500/20 w-32 h-32 blur-3xl rounded-full"></div>
              <p className="text-gray-300 text-sm">Withdrawable Balance</p>
              <h1 className="text-4xl font-bold mt-1">₹ {(user?.walletBalance / 1000).toFixed(2)}</h1>
              <div className="mt-4 flex gap-3">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg flex-1 transition">Withdraw</button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg flex-1 transition">History</button>
              </div>
            </div>

            {/* Tools Grid (Logic: 2 Referrals to Unlock) */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span> Premium Tools
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ToolCard title="CV Builder" icon="📄" locked={user?.referralCount < 2} />
                <ToolCard title="Love Calculator" icon="❤️" locked={user?.referralCount < 2} />
                <ToolCard title="Marriage Date" icon="💍" locked={user?.referralCount < 2} />
                <ToolCard title="Career 2035" icon="🚀" locked={user?.referralCount < 2} />
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">
                🔒 Refer 2 friends to unlock Premium Tools
              </p>
            </div>
          </>
        )}

        {/* --- TASKS SECTION (Real Channels) --- */}
        {tab === 'tasks' && (
          <div>
             <h3 className="text-lg font-bold mb-4">Complete Tasks</h3>
             <div className="space-y-3">
               <TaskItem name="Join English Room" reward={1000} link="https://t.me/The_EnglishRoom5" onClaim={() => handleTask(1000)} />
               <TaskItem name="Join UPSC Notes" reward={1000} link="https://t.me/UPSC_Notes_Official" onClaim={() => handleTask(1000)} />
               <TaskItem name="Join Gov Schemes" reward={1000} link="https://t.me/GovernmentSchemesIndia" onClaim={() => handleTask(1000)} />
               <TaskItem name="Watch Ad (Video)" reward={500} link="#" onClaim={() => handleTask(500)} />
             </div>
          </div>
        )}

        {/* --- LEADERBOARD SECTION --- */}
        {tab === 'rank' && (
           <div className="text-center">
             <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
             <h2 className="text-2xl font-bold">Leaderboard</h2>
             <p className="text-gray-400 text-sm mb-6">Reset in 24:00:00</p>
             <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
               <div className="flex justify-between border-b border-slate-700 pb-2 mb-2 text-gray-400 text-sm">
                 <span>Rank</span>
                 <span>User</span>
                 <span>Coins</span>
               </div>
               {/* Dummy Data for now */}
               {[1,2,3,4,5].map((i) => (
                 <div key={i} className="flex justify-between py-3 items-center">
                   <span className={`font-bold w-6 ${i===1?'text-yellow-400': 'text-white'}`}>#{i}</span>
                   <span className="flex-1 text-left ml-4">User {100+i}</span>
                   <span className="text-yellow-500 font-mono">{(10000/i).toFixed(0)}</span>
                 </div>
               ))}
             </div>
           </div>
        )}

      </div>

      {/* --- BOTTOM NAVIGATION --- */}
      <div className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3 z-50 shadow-2xl">
        <NavBtn icon={<Home size={20} />} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
        <NavBtn icon={<CheckCircle size={20} />} label="Tasks" active={tab === 'tasks'} onClick={() => setTab('tasks')} />
        <NavBtn icon={<Trophy size={20} />} label="Rank" active={tab === 'rank'} onClick={() => setTab('rank')} />
        <NavBtn icon={<Wallet size={20} />} label="Wallet" active={tab === 'wallet'} onClick={() => setTab('home')} />
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
const ToolCard = ({ title, icon, locked }) => (
  <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center justify-center h-32 relative border border-slate-700 hover:border-yellow-500/50 transition-all active:scale-95">
    {locked && (
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center z-10">
        <Lock className="text-yellow-500 w-6 h-6 mb-1" />
        <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wide">Locked</span>
      </div>
    )}
    <span className="text-3xl mb-2 drop-shadow-md">{icon}</span>
    <span className="font-semibold text-sm text-center text-gray-200">{title}</span>
  </div>
);

const TaskItem = ({ name, reward, link, onClaim }) => (
  <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700">
    <div>
      <h4 className="font-bold text-sm">{name}</h4>
      <p className="text-xs text-yellow-400 font-mono">+ {reward} Coins</p>
    </div>
    <a href={link} target="_blank" onClick={onClaim} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
      Open <ExternalLink size={12} />
    </a>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-colors ${active ? 'text-yellow-400' : 'text-slate-500'}`}>
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);

