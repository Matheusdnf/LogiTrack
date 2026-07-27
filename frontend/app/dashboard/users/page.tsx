"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Mail, Lock, CheckCircle2, AlertCircle, RefreshCw, Edit, Trash2 } from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser, User, CreateUserRequest, UpdateUserRequest } from "../../services/api";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("GESTOR");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    email: "",
    password: "",
    role: "GESTOR",
  });

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar usuários");
        setLoading(false);
      });
  };

  useEffect(() => {
    queueMicrotask(() => {
      const role = localStorage.getItem("userRole") || "GESTOR";
      setUserRole(role);
      loadUsers();
    });
  }, []);

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      email: u.email,
      password: "",
      role: u.role,
    });
    setFormError(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (u: User) => {
    setDeletingUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deletingUser.id);
      setSuccessMsg(`Usuário '${deletingUser.username}' foi removido com sucesso!`);
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      loadUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Erro ao excluir usuário.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!formData.username || !formData.email) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!editingUser && !formData.password) {
      setFormError("A senha é obrigatória para novos usuários.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }
        await updateUser(editingUser.id, updateData);
        setSuccessMsg(`Usuário '${formData.username}' atualizado com sucesso!`);
      } else {
        await createUser(formData);
        setSuccessMsg(`Usuário '${formData.username}' cadastrado com sucesso como ${formData.role}!`);
      }
      setFormData({ username: "", email: "", password: "", role: "GESTOR" });
      setEditingUser(null);
      setIsModalOpen(false);
      loadUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Erro ao salvar usuário.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = userRole === "ADMIN";

  if (!isAdmin && !loading) {
    return (
      <div className="glass p-8 rounded-2xl border border-red-200 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-12 bg-red-50/50 shadow-lg animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
          <Shield size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-red-700" style={{ fontFamily: "var(--font-outfit)" }}>
          Acesso Restrito ao Administrador (ADMIN)
        </h2>
        <p className="text-sm text-red-600 font-medium leading-relaxed">
          Seu perfil atual (<strong className="uppercase font-extrabold">{userRole}</strong>) possui acesso operacional às viagens, frota e manutenções no dashboard. Porém, a visualização e controle de membros e cargos são exclusivos do cargo <strong className="uppercase font-extrabold">ADMIN</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 border-b border-[#748ca6]/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#07497f] flex items-center gap-3" style={{ fontFamily: "var(--font-outfit)" }}>
            <Users className="text-[#0586c7]" size={32} />
            Gestão de Usuários e Acessos
          </h1>
          <p className="text-[#748ca6] mt-1 font-medium">
            Controle de Acesso Baseado em Papéis (RBAC) do LogiTrack
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="p-2.5 rounded-xl border border-[#748ca6]/30 text-[#748ca6] hover:text-[#07497f] hover:bg-[#748ca6]/10 transition-colors"
            title="Atualizar lista"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          {isAdmin ? (
            <button
              onClick={() => {
                setEditingUser(null);
                setFormData({ username: "", email: "", password: "", role: "GESTOR" });
                setIsModalOpen(true);
                setFormError(null);
                setSuccessMsg(null);
              }}
              className="bg-[#07497f] hover:bg-[#0586c7] text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus size={18} /> Novo Usuário
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Shield size={16} className="text-amber-600" />
              Apenas ADMIN pode cadastrar novos usuários
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 relative overflow-hidden group shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#0586c7]">
            <Users size={64} />
          </div>
          <p className="text-[#748ca6] text-sm font-semibold mb-1">Total de Usuários</p>
          <p className="text-3xl font-bold text-[#07497f]">{users.length} <span className="text-lg text-[#748ca6] font-semibold">cadastrados</span></p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 relative overflow-hidden group shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#7e22ce]">
            <Shield size={64} />
          </div>
          <p className="text-[#748ca6] text-sm font-semibold mb-1">Administradores (ADMIN)</p>
          <p className="text-3xl font-bold text-[#7e22ce]">{users.filter(u => u.role === 'ADMIN').length} <span className="text-lg text-[#748ca6] font-semibold">admins</span></p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 relative overflow-hidden group shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#0d9488]">
            <Users size={64} />
          </div>
          <p className="text-[#748ca6] text-sm font-semibold mb-1">Gestores de Frota (GESTOR)</p>
          <p className="text-3xl font-bold text-[#0d9488]">{users.filter(u => u.role === 'GESTOR').length} <span className="text-lg text-[#748ca6] font-semibold">gestores</span></p>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 shadow-md">
        <h3 className="text-lg font-bold text-[#07497f] mb-6 flex items-center justify-between">
          <span>Usuários Ativos no Sistema</span>
          <span className="text-xs font-semibold text-[#748ca6] bg-[#748ca6]/10 px-3 py-1 rounded-full">
            Seu perfil atual: <strong className="text-[#07497f] uppercase">{userRole}</strong>
          </span>
        </h3>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0586c7]"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600 font-semibold flex flex-col items-center gap-2">
            <AlertCircle size={32} />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#748ca6]/20 text-[#748ca6] text-sm">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Nome de Usuário</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold text-center">Cargo (Role)</th>
                  <th className="pb-3 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-[#748ca6]/10 hover:bg-[#748ca6]/5 transition-colors">
                      <td className="py-4 text-[#748ca6] font-bold">#{u.id}</td>
                      <td className="py-4 font-extrabold text-[#07497f] text-base flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#07497f]/10 flex items-center justify-center font-bold text-xs text-[#07497f] uppercase">
                          {u.username.charAt(0)}
                        </div>
                        {u.username}
                      </td>
                      <td className="py-4 font-medium text-[#748ca6]">{u.email}</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-[#7e22ce]/15 text-[#7e22ce] border border-[#7e22ce]/40 shadow-sm' : 'bg-[#0586c7]/15 text-[#0586c7] border border-[#0586c7]/40'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm"
                            title="Editar Usuário"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(u)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 shadow-sm"
                            title="Excluir Usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#748ca6] italic font-medium">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição de Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass bg-white p-6 md:p-8 rounded-2xl max-w-md w-full border border-[#748ca6]/30 shadow-2xl relative">
            <h3 className="text-xl font-bold text-[#07497f] mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
              {editingUser ? <Edit size={24} className="text-[#0586c7]" /> : <UserPlus size={24} className="text-[#0586c7]" />}
              {editingUser ? "Editar Usuário" : "Cadastrar Novo Usuário"}
            </h3>
            <p className="text-xs text-[#748ca6] mb-6 font-medium">
              {editingUser ? "Altere os dados de perfil ou cargo do membro." : "Defina as credenciais e o cargo (permissão) no sistema."}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#07497f] uppercase tracking-wider mb-1">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Ex: Carlos Silva"
                    className="w-full pl-3 pr-4 py-2.5 bg-white/80 border border-[#748ca6]/30 rounded-xl text-sm focus:outline-none focus:border-[#07497f] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#07497f] uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="carlos@logitrack.com"
                    className="w-full pl-3 pr-4 py-2.5 bg-white/80 border border-[#748ca6]/30 rounded-xl text-sm focus:outline-none focus:border-[#07497f] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#07497f] uppercase tracking-wider mb-1">
                  {editingUser ? "Nova Senha (opcional)" : "Senha Temporária"}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
                    className="w-full pl-3 pr-4 py-2.5 bg-white/80 border border-[#748ca6]/30 rounded-xl text-sm focus:outline-none focus:border-[#07497f] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#07497f] uppercase tracking-wider mb-1">
                  Cargo (Permissão no Sistema)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/80 border border-[#748ca6]/30 rounded-xl text-sm focus:outline-none focus:border-[#07497f] font-medium text-[#07497f]"
                >
                  <option value="GESTOR">GESTOR (Operação de Frota, Viagens e Relatórios)</option>
                  <option value="ADMIN">ADMIN (Acesso Total + Gerenciar Usuários)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#748ca6]/20 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#748ca6] hover:bg-[#748ca6]/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#07497f] hover:bg-[#0586c7] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center gap-2"
                >
                  {submitting ? "Salvando..." : editingUser ? "Salvar Alterações" : "Criar Usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Componente de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Usuário"
        description={
          deletingUser
            ? `Tem certeza que deseja excluir permanentemente o usuário '${deletingUser.username}' (${deletingUser.email})? O acesso ao sistema será revogado imediatamente.`
            : "Tem certeza que deseja excluir este usuário?"
        }
        loading={deleteLoading}
      />
    </>
  );
}
