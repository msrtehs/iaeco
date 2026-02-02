
import React from 'react';
import { Leaf, Award, Calendar } from 'lucide-react';
import { storage } from '../services/storageService';

const IPTUVerde: React.FC = () => {
  const user = storage.getCurrentUser();
  const points = user?.points || 0;
  
  const getLevel = (pts: number) => {
    if (pts > 1000) return 'Guardião Lendário';
    if (pts > 500) return 'Guardião da Natureza';
    return 'Eco Cidadão';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <Leaf className="text-emerald-200" size={32} />
                <h2 className="text-3xl font-bold">IPTU Verde</h2>
            </div>
            <p className="text-emerald-100 max-w-lg text-lg">
                Seu engajamento ambiental gera créditos tributários. Acumule pontos através de coletas e ações sustentáveis.
            </p>
        </div>
        <Leaf size={300} className="absolute -right-10 -bottom-20 text-white opacity-10 rotate-12" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Score Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
           <div className="w-32 h-32 rounded-full border-8 border-emerald-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-bold text-emerald-600">{points}</span>
              <Award className="absolute -top-2 -right-2 text-yellow-500 bg-white rounded-full p-1 shadow-sm" size={32} />
           </div>
           <h3 className="text-xl font-bold text-gray-800">Seus Pontos Eco</h3>
           <p className="text-gray-500 text-sm mt-2">Nível atual: <span className="text-emerald-600 font-bold">{getLevel(points)}</span></p>
        </div>

        {/* History List */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              Atividades Recentes
           </h3>
           <div className="space-y-4">
              {[
                { title: 'Solicitação de Coleta', date: 'Recente', pts: '+50' },
                { title: 'Cadastro no Portal', date: 'Início', pts: '+0' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                    <div>
                        <p className="font-medium text-sm text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">{item.pts}</span>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-2 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors">
              Ver Extrato Completo
           </button>
        </div>

      </div>
    </div>
  );
};

export default IPTUVerde;
