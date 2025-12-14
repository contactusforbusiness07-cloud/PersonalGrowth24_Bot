
import React, { useState, useEffect } from 'react';
import { Home, Trophy, Wallet, CheckCircle, Lock } from 'lucide-react';

// API BASE URL (Render URL baad me yaha update karna)
const API_URL = "https://pro-earner-app.onrender.com/api"; 

export default function App() {
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Telegram User ID Fake for Browser Testing (Real me Telegram se aayega)
  const tg = window.Telegram.WebApp;
  const userId = tg.initDataUnsafe?.user?.id || "123456"; 

  useEffect(() => {
    tg.ready();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (e) { console.log("User load error", e); }
  };

  const loadLeaderboard = async () => {
    const res = await fetch(`${API_URL}/leaderboard`);
    const data = await res.json();
    setLeaderboard(data);
  };

  return (
    <div className="pb-20 min-h-screen bg-slate-900 text-white font-sans">
      
      {/* HEADER */}
      <div className="p-4 bg-slate-800 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold text-yellow-400">ProEarner</h1>
        <div className="bg-slate-700 px-3 py-1 rounded-full text-sm">
          🪙 {user?.walletBalance || 0}
        </div>
      </div>

      {/* CONTENT PAGES */}
      <div className="p-4">
        
        {/* --- HOME TAB --- */}
        {tab === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg">
              <p className="text-blue-100">Total Balance</p>
              <h1 className="text-4xl font-bold">₹ {(user?.walletBalance || 0) / 100}</h1>
              <p className="text-xs mt-2 text-blue-200">Withdraw limit: ₹500</p>
            </div>

            <h3 className="font-bold text-lg border-l-4 border-yellow-500 pl-2">Premium Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <ToolCard title="CV Builder" icon="📄" locked={user?.referralCount < 2} />
              <ToolCard title="Love Calc" icon="❤️" locked={user?.referralCount < 2} />
              <ToolCard title="Future Date" icon="🔮" locked={user?.referralCount < 2} />
              <ToolCard title="Career AI" icon="🚀" locked={user?.referralCount < 2} />
            </div>
          </div>
        )}

        {/* --- LEADERBOARD TAB --- */}
        {tab === 'rank' && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">🏆 Top Earners (24h)</h2>
            <button onClick={loadLeaderboard} className="w-full bg-slate-700 mb-4 p-2 rounded">Refresh Rank</button>
            <div className="space-y-2">
              {leaderboard.map((u, i) => (
                <div key={i} className="flex items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${i<3 ? 'bg-yellow-500 text-black' : 'bg-slate-600'}`}>
                    {i+1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{u.name}</p>
                  </div>
                  <div className="text-yellow-400 font-mono">{u.coins} 🪙</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TASKS TAB --- */}
        {tab === 'task' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Earn Coins</h2>
            <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold">Join Telegram Channel</p>
                <p className="text-xs text-gray-400">+500 Coins</p>
              </div>
              <button className="bg-blue-600 px-4 py-1 rounded-full text-sm">Join</button>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3 z-50">
        <NavBtn icon={<Home />} label="Home" active={tab==='home'} onClick={()=>setTab('home')} />
        <NavBtn icon={<Trophy />} label="Rank" active={tab==='rank'} onClick={()=>{setTab('rank'); loadLeaderboard();}} />
        <NavBtn icon={<CheckCircle />} label="Tasks" active={tab==='task'} onClick={()=>setTab('task')} />
      </div>
    </div>
  );
}

// Components
const ToolCard = ({ title, icon, locked }) => (
  <div className="bg-slate-800 h-32 rounded-xl flex flex-col items-center justify-center relative border border-slate-700">
    {locked && (
      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10 backdrop-blur-[2px]">
        <Lock className="text-white w-6 h-6" />
      </div>
    )}
    <span className="text-3xl mb-2">{icon}</span>
    <span className="font-medium text-sm">{title}</span>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center ${active ? 'text-yellow-400' : 'text-gray-500'}`}>
    {icon}
    <span className="text-[10px] mt-1">{label}</span>
  </button>
);
