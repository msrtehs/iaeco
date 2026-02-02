import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Trash2, MapPin, Truck, Lightbulb, ChevronRight } from 'lucide-react';
import { analyzeWasteDescription, generateEcoTip } from '../services/geminiService';
import { WasteAnalysis } from '../types';

const CollectionRequest: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');
  const [tip, setTip] = useState<string>('');

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeWasteDescription(description);
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep('review');
  };

  const handleConfirm = async () => {
    // Simulate API call to save request
    setIsAnalyzing(true); // Reuse loading state
    
    // Generate Tip in background while "submitting"
    if (analysis) {
        const generatedTip = await generateEcoTip(analysis.category);
        setTip(generatedTip);
    }
    
    setTimeout(() => {
        setIsAnalyzing(false);
        setStep('success');
    }, 1500);
  };

  const resetForm = () => {
    setDescription('');
    setAnalysis(null);
    setStep('input');
    setTip('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-green-900 mb-2">Solicitar Coleta</h2>
      <p className="text-gray-600 mb-8">Nossa IA ajuda a classificar seu resíduo para o destino correto.</p>

      {/* Step 1: Input */}
      {step === 'input' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 animate-fade-in border border-green-50">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">O que você precisa descartar?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Sofá velho de 2 lugares, TV quebrada, 3 sacos de folhas secas..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Lightbulb size={18} /></div>
             <p>Seja detalhado! A IA identifica melhor se você disser o material e o tamanho.</p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!description.trim() || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
                <>Analisando...</>
            ) : (
                <>
                    Analisar com IA <Camera size={20} />
                </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 'review' && analysis && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up border border-green-50">
          <div className="bg-green-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 /> Análise Concluída
            </h3>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Categoria</span>
                <p className="text-lg font-bold text-green-700 mt-1">{analysis.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Confiança IA</span>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(analysis.confidence || 0.8) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-600">{Math.round((analysis.confidence || 0.8) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm mb-1">Recomendação</h4>
                <p className="text-amber-700 text-sm leading-relaxed">{analysis.recommendation}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600 text-sm p-4 bg-gray-50 rounded-xl">
               <Truck size={18} className="text-green-600" />
               <span>Destino: <strong>{analysis.destination}</strong></span>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('input')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? "Enviando..." : "Confirmar Solicitação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success & Education */}
      {step === 'success' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-8 animate-scale-in border-t-8 border-green-500">
          
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Solicitação Recebida!</h3>
            <p className="text-gray-500">Número do protocolo: <span className="font-mono text-gray-700">#REQ-{Math.floor(Math.random() * 10000)}</span></p>
          </div>

          {/* Micro Tip Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden text-left shadow-inner">
             <div className="absolute -right-6 -top-6 text-emerald-100/50">
                 <Lightbulb size={120} />
             </div>
             <div className="relative z-10">
                 <span className="inline-block bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded mb-2 font-bold">Dica Eco</span>
                 <p className="text-emerald-900 font-medium text-lg italic">"{tip}"</p>
             </div>
          </div>

          <button
            onClick={resetForm}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full"
          >
            Nova Solicitação
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionRequest;