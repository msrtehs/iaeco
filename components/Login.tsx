
import React, { useState } from 'react';
import { Leaf, LogIn, UserPlus, ShieldCheck, Lock, Mail, User as UserIcon, Briefcase } from 'lucide-react';
import { storage } from '../services/storageService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    const users = storage.getUsers();

    if (isRegistering) {
      if (users.find(u => u.email === email)) {
        setError('Este email já está cadastrado.');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'citizen',
        status: 'active',
        points: 0
      };
      storage.saveUser(newUser);
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === email);
      if (user) {
        if (user.status === 'inactive') {
          setError('Sua conta está desativada. Entre em contato com a prefeitura.');
          return;
        }
        onLogin(user);
      } else {
        setError('Usuário não encontrado ou senha incorreta.');
      }
    }
  };

  const handleManagerAccess = () => {
    const users = storage.getUsers();
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      onLogin(admin);
    } else {
      // Fallback caso o admin padrão tenha sido removido
      const defaultAdmin: User = { id: '1', name: 'Admin Municipal', email: 'admin@prefeitura.gov', role: 'admin', status: 'active', points: 0 };
      storage.saveUser(defaultAdmin);
      onLogin(defaultAdmin);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-white/50 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">IAeco</h1>
          <p className="text-gray-500 text-sm">Portal Ambiental do Cidadão</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            {isRegistering ? <><UserPlus size={18}/> Criar Conta</> : <><LogIn size={18}/> Entrar</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            {isRegistering ? 'Já possui cadastro?' : 'Novo por aqui?'}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="ml-2 text-green-600 font-bold hover:underline"
            >
              {isRegistering ? 'Fazer Login' : 'Criar Conta Grátis'}
            </button>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
           <button 
             onClick={handleManagerAccess}
             className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all group"
           >
             <Briefcase size={18} className="group-hover:scale-110 transition-transform" />
             Acesso para Gestores
           </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
           <ShieldCheck size={12} className="text-green-500" /> 
           Ambiente Seguro Prefeitura Municipal
        </div>
      </div>
    </div>
  );
};

export default Login;
