import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

type FilterType = 'todas' | 'pendentes' | 'concluidas';

export function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");

  // Novos estados para filtro, pesquisa e edição
  const [filter, setFilter] = useState<FilterType>('todas');
  const [search, setSearch] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const payload = JSON.parse(decodedPayload);
        if (payload.name) {
          const primeiroNome = payload.name.split(' ')[0];
          setUserName(primeiroNome);
        }
      } catch (e) {
        console.error("Erro ao decodificar token", e);
      }
    }
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        data.sort((a: Task, b: Task) => a.status === 'concluida' ? 1 : -1);
        setTasks(data);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: ""
        })
      });

      if (response.ok) {
        setNewTaskTitle("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const token = localStorage.getItem("token");
    const novoStatus = task.status === "pendente" ? "concluida" : "pendente";

    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus })
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  // 5. Edita a tarefa (Salvar)
  const handleSaveEdit = async (task: Task) => {
    if (!editingTaskTitle.trim() || editingTaskTitle === task.title) {
      setEditingTaskId(null);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTaskTitle })
      });
      if (response.ok) {
        setEditingTaskId(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Filtragem das tarefas
  const filteredTasks = tasks.filter(task => {
    // Primeiro filtro: Abas
    if (filter === 'pendentes' && task.status === 'concluida') return false;
    if (filter === 'concluidas' && task.status === 'pendente') return false;

    // Segundo filtro: Pesquisa
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4 relative h-screen flex flex-col pb-10">
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-slate-800/80 hover:bg-red-500/80 text-slate-300 hover:text-white px-5 py-2 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-300 text-sm font-medium shadow-lg z-10"
      >
        Sair da Conta
      </button>

      {/* O "Quadradinho" principal agora tem altura máxima e usa flex-col */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 mt-10 flex flex-col flex-1 overflow-hidden">
        
        {/* CABEÇALHO (Fixo) */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold mb-2">
            {userName ? `Olá, ${userName}! 👋` : "Minhas Tarefas"}
          </h1>
          <p className="text-slate-400 mb-8 text-sm">
            Acompanhe suas metas e organize seu dia.
          </p>
          
          {/* Adicionar nova tarefa */}
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="O que você precisa fazer?" 
              className="flex-1 p-4 bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button 
              onClick={handleAddTask}
              disabled={isLoading || !newTaskTitle.trim()}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-white font-semibold px-8 rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(139,92,246,0.3)] flex-shrink-0"
            >
              {isLoading ? "..." : "Adicionar"}
            </button>
          </div>

          {/* Barra de Pesquisa e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-slate-900/30 p-2 rounded-lg border border-white/5">
            <div className="flex gap-2 w-full md:w-auto">
              {(['todas', 'pendentes', 'concluidas'] as FilterType[]).map((f) => {
                const count = 
                  f === 'todas' ? tasks.length :
                  f === 'pendentes' ? tasks.filter(t => t.status === 'pendente').length :
                  tasks.filter(t => t.status === 'concluida').length;

                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize flex items-center justify-center gap-2 ${
                      filter === f
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{f}</span>
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        filter === f 
                          ? 'bg-white/25 text-white' 
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="w-full md:w-64 relative">
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* LISTA DE TAREFAS (Scrollável) */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {filteredTasks.length === 0 ? (
            <div className="text-slate-400 text-center py-12 bg-slate-900/20 rounded-xl border border-white/5 border-dashed">
              <p className="text-lg mb-2">nenhuma tarefa encontrada 📭</p>
              <p className="text-sm opacity-60">
                {search ? "Tente buscar com outras palavras." : "Que tal começar adicionando uma nova meta?"}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex justify-between items-center p-4 border rounded-lg transition-all duration-300 group ${
                  task.status === 'concluida' 
                    ? 'bg-emerald-900/10 border-emerald-500/20 opacity-70' 
                    : 'bg-slate-900/40 border-white/5 hover:border-violet-500/30 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Botão de Check / Desfazer */}
                  <button 
                    onClick={() => handleToggleStatus(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                      task.status === 'concluida' 
                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                        : 'border-slate-500 hover:border-emerald-400'
                    }`}
                  >
                    {task.status === 'concluida' && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Título ou Input de Edição */}
                  <div className="flex-1 mr-4">
                    {editingTaskId === task.id ? (
                      <input 
                        autoFocus
                        type="text"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(task)}
                        onBlur={() => handleSaveEdit(task)}
                        className="w-full bg-slate-900/80 border border-violet-500/50 rounded px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    ) : (
                      <h3 
                        onDoubleClick={() => {
                          setEditingTaskId(task.id);
                          setEditingTaskTitle(task.title);
                        }}
                        className={`font-medium text-lg transition-colors cursor-text ${
                          task.status === 'concluida' ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>
                    )}
                  </div>
                </div>

                {/* Ações (Editar e Deletar) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                    }}
                    className="text-slate-500 hover:text-sky-400 p-2 transition-colors rounded-md hover:bg-sky-400/10"
                    title="Editar tarefa"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-slate-500 hover:text-red-400 p-2 transition-colors rounded-md hover:bg-red-400/10"
                    title="Deletar tarefa"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
