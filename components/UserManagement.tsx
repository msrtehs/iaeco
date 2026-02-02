
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { User } from '../types';
import { UserCog, UserMinus, UserCheck, Shield, Trash2, Search } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const toggleStatus = (user: User) => {
    const updated = { ...user, status: user.status === 'active' ? 'inactive' : 'active' as any };
    storage.saveUser(updated);
    setUsers(storage.getUsers());
  };

  const deleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      storage.deleteUser(id);
      setUsers(storage.getUsers());
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCog className="text-green-600" /> Gerenciar Usuários
          </h2>
          <p className="text-gray-500 text-sm">Controle de acesso e moderação da plataforma.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar nome ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Usuário</th>
                <th className="px-6 py-4 font-bold">Perfil</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Pontos</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${user.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                      {user.status === 'active' ? <UserCheck size={14}/> : <UserMinus size={14}/>}
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {user.points} pts
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => toggleStatus(user)}
                      className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                      title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                    >
                      {user.status === 'active' ? <UserMinus size={18}/> : <UserCheck size={18}/>}
                    </button>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir Permanentemente"
                      >
                        <Trash2 size={18}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm">Nenhum usuário encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
