import React from 'react';
import { MessageSquare, Truck, Leaf, ArrowRight, MapPin } from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-800 text-white shadow-2xl p-6 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center bg-green-500/30 backdrop-blur px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 border border-green-400/30">
            <span className="animate-pulse w-2 h-2 bg-white rounded-full mr-2"></span>
            IA Ativa e Pronta
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Transformando resíduos em <span className="text-green-300">soluções inteligentes</span>.
          </h2>
          <p className="text-green-100 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
            Use nossa Inteligência Artificial para identificar resíduos, agendar coletas e ganhar recompensas no programa IPTU Verde.
          </p>
          <button 
            onClick={() => setView('chat')}
            className="w-full md:w-auto group bg-white text-green-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-green-50 transition-all flex items-center justify-center"
          >
            Falar com Assistente Eco
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute -right-20 -bottom-40 opacity-20 pointer-events-none">
          <Leaf size={300} className="md:w-[400px] md:h-[400px]" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        <div onClick={() => setView('chat')} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-green-500 hover:-translate-y-1 active:scale-95">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
            <MessageSquare className="text-green-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Dúvidas Rápidas</h3>
          <p className="text-gray-500 text-sm">Não sabe se é reciclável? Pergunte ao nosso chat inteligente e receba respostas imediatas.</p>
        </div>

        <div onClick={() => setView('request')} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-blue-500 hover:-translate-y-1 active:scale-95">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
            <Truck className="text-blue-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Coleta Inteligente</h3>
          <p className="text-gray-500 text-sm">Descreva o resíduo (ex: sofá velho) e a IA classifica e agenda o caminhão certo para você.</p>
        </div>

        <div onClick={() => setView('iptu')} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-emerald-500 hover:-translate-y-1 active:scale-95">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
            <Leaf className="text-emerald-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">IPTU Verde</h3>
          <p className="text-gray-500 text-sm">Acumule pontos com suas ações sustentáveis e acompanhe seu progresso para descontos.</p>
        </div>

      </section>

      {/* Stats / Info */}
      <section className="bg-green-900 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-bold mb-2">Onde descartar?</h4>
          <p className="text-green-300 text-sm md:text-base">Encontre o Ponto de Entrega Voluntária (PEV) mais próximo.</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
           <div className="flex-1 md:flex-none text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl md:text-3xl font-bold">12</span>
              <span className="text-[10px] md:text-xs text-green-200 uppercase tracking-wide">Ecopontos</span>
           </div>
           <div className="flex-1 md:flex-none text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl md:text-3xl font-bold">5k+</span>
              <span className="text-[10px] md:text-xs text-green-200 uppercase tracking-wide">Coletas</span>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;