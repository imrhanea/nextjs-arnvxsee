"use client";
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://acikiygkeqdylfrfjlua.supabase.co";
const SUPABASE_KEY = "sb_publishable_i3PbEymn-_QHCTezB85kbA_2NxBES_1";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SUPABASE_URL+"/rest/v1/leads?order=created_at.desc", {
      headers: {"apikey": SUPABASE_KEY, "Authorization": "Bearer "+SUPABASE_KEY}
    }).then(r=>r.json()).then(data=>{setLeads(data);setLoading(false);});
  }, []);

  const total = leads.length;
  const today = leads.filter(l=>new Date(l.created_at).toDateString()===new Date().toDateString()).length;
  const prizes = leads.reduce((acc,l)=>{acc[l.prize]=(acc[l.prize]||0)+1;return acc;},{});
  const topPrize = Object.entries(prizes).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard FidUP</h1>
            <p className="text-gray-400 mt-1">Vos clients collectes</p>
          </div>
          <a href="/" className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-700">Voir la roue</a>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total clients</p>
            <p className="text-4xl font-bold text-purple-400">{loading ? "..." : total}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Aujourd hui</p>
            <p className="text-4xl font-bold text-green-400">{loading ? "..." : today}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Prix populaire</p>
            <p className="text-xl font-bold text-amber-400">{loading ? "..." : (topPrize ? topPrize[0] : "-")}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold text-gray-200">Liste des clients</h2>
            <span className="text-xs text-gray-500">{total} entrees</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun client encore. Partagez la roue !</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Prix gagne</th>
                  <th className="p-4 text-left">Date</th>
                </tr></thead>
                <tbody>
                  {leads.map((l,i)=>(
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="p-4 text-sm text-gray-200">{l.email}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">{l.prize}</span></td>
                      <td className="p-4 text-xs text-gray-500">{new Date(l.created_at).toLocaleDateString("fr-CA", {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
