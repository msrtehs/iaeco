
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { 
  Product, 
  Inventory, 
  PurchaseRequest, 
  PurchaseOrder, 
  FinanceTransaction 
} from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area 
} from 'recharts';

const BusinessManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dash' | 'stock' | 'purchases' | 'finance'>('dash');
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [finance, setFinance] = useState<FinanceTransaction[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setProducts(storage.getProducts());
    setInventory(storage.getInventory());
    setRequests(storage.getPurchaseRequests());
    setOrders(storage.getPurchaseOrders());
    setFinance(storage.getFinance());
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  // Lógica de Aprovação de Compra
  const handleApprove = (req: PurchaseRequest) => {
    const product = getProduct(req.productId);
    if (!product) return;

    const totalValue = product.costPrice * req.suggestedQty;

    // 1. Criar Pedido de Compra
    const newOrder: PurchaseOrder = {
      id: `ORD-${Date.now()}`,
      supplierId: product.supplierId,
      totalValue: totalValue,
      orderDate: new Date().toLocaleDateString(),
      deliveryStatus: 'Pendente'
    };
    storage.savePurchaseOrder(newOrder);

    // 2. Registrar no Financeiro como Despesa
    const transaction: FinanceTransaction = {
      id: `FIN-${Date.now()}`,
      type: 'Despesa',
      value: totalValue,
      category: 'Compra de Estoque',
      date: new Date().toLocaleDateString(),
      referenceOrderId: newOrder.id
    };
    storage.saveTransaction(transaction);

    // 3. Atualizar Status da Solicitação
    storage.savePurchaseRequest({ ...req, status: 'Aprovado' });

    // 4. Simular recebimento e atualizar estoque
    const invItem = inventory.find(i => i.productId === req.productId);
    if (invItem) {
      storage.saveInventoryItem({
        ...invItem,
        currentQty: invItem.currentQty + req.suggestedQty
      });
    }

    alert('Fluxo completo: Pedido gerado, despesa lançada e estoque atualizado!');
    loadAllData();
  };

  const criticalInventory = inventory.filter(i => i.currentQty <= i.minQty);
  const pendingRequests = requests.filter(r => r.status === 'Pendente');

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header Gestão */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Miguel | Gestão IAeco</h2>
          <p className="text-gray-500 text-sm">Orquestração de Estoque, Compras e Finanças.</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
          {[
            { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'stock', label: 'Monitor Estoque', icon: Package },
            { id: 'purchases', label: 'Compras', icon: ShoppingCart },
            { id: 'finance', label: 'Financeiro', icon: DollarSign },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <t.icon size={16} /> <span className="hidden lg:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD GERAL */}
      {activeTab === 'dash' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Itens Críticos" value={criticalInventory.length} color="red" icon={AlertCircle} />
            <StatCard label="Pedidos Pendentes" value={orders.filter(o => o.deliveryStatus === 'Pendente').length} color="amber" icon={Clock} />
            <StatCard label="Saldo Disponível" value={`R$ ${finance.reduce((acc, t) => t.type === 'Receita' ? acc + t.value : acc - t.value, 50000).toLocaleString()}`} color="green" icon={TrendingUp} />
            <StatCard label="Produtos Ativos" value={products.length} color="indigo" icon={Tag} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" /> Fluxo de Caixa (Despesas vs Receitas)
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={finance.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={18} className="text-blue-500" /> Níveis de Estoque por Produto
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventory.map(i => ({ name: getProduct(i.productId)?.name.substring(0, 10), qty: i.currentQty, min: i.minQty }))}>
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="min" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONITOR DE ESTOQUE */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2"><Package size={20}/> Monitor de Estoque Real-Time</h3>
             <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
               <Plus size={16}/> Adicionar Produto
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 text-center">Mínimo (Ponto Pedido)</th>
                  <th className="px-6 py-4 text-center">Qtd Atual</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item, idx) => {
                  const p = getProduct(item.productId);
                  const isCritical = item.currentQty <= item.minQty;
                  return (
                    <tr key={idx} className={`hover:bg-gray-50 transition-colors ${isCritical ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{p?.name}</div>
                        <div className="text-[10px] text-gray-400">{p?.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><MapPin size={12}/> {item.location}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-400">{item.minQty}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-mono font-bold text-lg ${isCritical ? 'text-red-600' : 'text-green-600'}`}>
                          {item.currentQty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isCritical ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isCritical ? <AlertCircle size={12}/> : <CheckCircle2 size={12}/>}
                          {isCritical ? 'Reposicão Imediata' : 'Normal'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAINEL DE COMPRAS */}
      {activeTab === 'purchases' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-slide-up">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Clock size={20} className="text-amber-500"/> Sugestões de Compra (Subagente Miguel)</h3>
                {pendingRequests.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">Sem solicitações pendentes no momento.</div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((req, idx) => {
                      const p = getProduct(req.productId);
                      return (
                        <div key={idx} className="bg-gray-50 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                          <div className="flex-1">
                             <div className="font-bold text-gray-800">{p?.name}</div>
                             <div className="text-xs text-gray-500">Sugestão: {req.suggestedQty} unidades | Custo Unit: R$ {p?.costPrice.toFixed(2)}</div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                             <div className="text-lg font-bold text-indigo-600 mr-4">R$ {(p!.costPrice * req.suggestedQty).toLocaleString()}</div>
                             <button 
                               onClick={() => handleApprove(req)}
                               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
                             >
                               <CheckCircle2 size={16}/> Aprovar
                             </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><ShoppingCart size={20} className="text-indigo-500"/> Histórico de Pedidos Efetuados</h3>
                <div className="space-y-3">
                  {orders.map((o, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border border-gray-50 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs">{o.id.split('-')[1].substring(5)}</div>
                          <div>
                            <div className="text-sm font-bold text-gray-800">Fornecedor ID: {o.supplierId}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{o.orderDate}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-bold text-gray-700">R$ {o.totalValue.toLocaleString()}</div>
                          <div className="text-[10px] font-bold text-amber-500 uppercase">{o.deliveryStatus}</div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between h-fit lg:sticky lg:top-10">
             <div>
                <AlertCircle size={40} className="mb-6 text-indigo-300" />
                <h3 className="text-2xl font-bold mb-4">Miguel Insights</h3>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  Detectamos que o consumo de <strong>Luvas Nitrílicas</strong> aumentou 22% nos últimos 15 dias. 
                  Recomendamos aprovar a solicitação de 40 unidades para evitar desabastecimento.
                </p>
             </div>
             <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-indigo-300 mb-2">Previsão de Despesa</div>
                <div className="text-2xl font-bold">R$ 4.250,00</div>
             </div>
          </div>
        </div>
      )}

      {/* VISÃO FINANCEIRA */}
      {activeTab === 'finance' && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><DollarSign size={20}/> Fluxo de Transações</h3>
                 <div className="space-y-4">
                   {finance.length === 0 ? (
                     <div className="text-center py-20 text-gray-400">Nenhuma movimentação financeira registrada.</div>
                   ) : (
                     finance.map((t, idx) => (
                       <div key={idx} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-xl ${t.type === 'Receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {t.type === 'Receita' ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}
                             </div>
                             <div>
                                <div className="font-bold text-gray-800">{t.category}</div>
                                <div className="text-[10px] text-gray-400 uppercase">{t.date} | Ref: {t.referenceOrderId || 'Manual'}</div>
                             </div>
                          </div>
                          <div className={`text-xl font-mono font-bold ${t.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'Receita' ? '+' : '-'} R$ {t.value.toLocaleString()}
                          </div>
                       </div>
                     ))
                   )}
                 </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                 <h3 className="font-bold text-gray-800 mb-6">Consolidado Mensal</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">Total Receitas</span>
                       <span className="font-bold text-green-600">+ R$ 45.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">Total Despesas</span>
                       <span className="font-bold text-red-600">- R$ {finance.filter(f => f.type === 'Despesa').reduce((acc, f) => acc + f.value, 0).toLocaleString()}</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                       <span className="font-bold text-gray-800">Saldo Final</span>
                       <span className="text-2xl font-bold text-indigo-600">R$ {(45000 - finance.filter(f => f.type === 'Despesa').reduce((acc, f) => acc + f.value, 0)).toLocaleString()}</span>
                    </div>
                 </div>
                 <button className="w-full mt-10 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                    Exportar Relatório <ArrowRight size={18}/>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Componente Auxiliar de Card de Estatística
const StatCard = ({ label, value, color, icon: Icon }: any) => {
  const colors: any = {
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };
  return (
    <div className={`p-6 rounded-3xl border shadow-sm bg-white`}>
      <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-black text-gray-800 mt-1">{value}</div>
    </div>
  );
};

export default BusinessManagement;
