import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { getAdminInsights } from '../services/geminiService';

const mockData = [
  { name: 'Centro', requests: 400, type: 'Comum' },
  { name: 'Jd. Flores', requests: 300, type: 'Poda' },
  { name: 'Vila Nova', requests: 200, type: 'Volumoso' },
  { name: 'Industrial', requests: 278, type: 'Reciclável' },
  { name: 'Lagoa', requests: 189, type: 'Orgânico' },
];

const pieData = [
  { name: 'Reciclável', value: 35 },
  { name: 'Orgânico', value: 45 },
  { name: 'Volumoso', value: 10 },
  { name: 'Eletrônico', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard: React.FC = () => {
  const [insight, setInsight] = useState<{ summary: string; trend: string; suggestion: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    const summaryString = JSON.stringify({ barData: mockData, pieData });
    const result = await getAdminInsights(summaryString);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Painel de Gestão</h2>
          <p className="text-gray-500">Visão geral das coletas e demandas urbanas.</p>
        </div>
        <button 
          onClick={generateReport}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-70"
        >
          {loading ? <Sparkles className="animate-spin" size={18}/> : <Sparkles size={18} />}
          {loading ? 'Analisando...' : 'Gerar Insights IA'}
        </button>
      </div>

      {/* AI Insights Section */}
      {insight && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm animate-slide-down">
          <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-indigo-600" />
            Análise Inteligente
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-indigo-400 uppercase">Resumo</span>
              <p className="text-gray-800 text-sm mt-1">{insight.summary}</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border-l-4 border-green-400">
              <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1"><TrendingUp size={12}/> Tendência</span>
              <p className="text-gray-800 text-sm mt-1">{insight.trend}</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border-l-4 border-amber-400">
              <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1"><AlertTriangle size={12}/> Sugestão</span>
              <p className="text-gray-800 text-sm mt-1">{insight.suggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6">Solicitações por Bairro</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{fill: '#f0fdf4'}}
                />
                <Bar dataKey="requests" radius={[4, 4, 0, 0]}>
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#16a34a' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6">Tipos de Resíduos (Semanal)</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
             {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                   {entry.name}
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;