import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

export function Login() {
  // 1. Criamos os "estados" (memória) para guardar o que o usuário digita
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // 2. Criamos a função que será disparada ao enviar o formulário
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    setError(""); // Limpa erros antigos
    setIsLoading(true);

    try {
      // Fazemos a chamada para o nosso backend (O Garçom!)
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha no login");
      }

      // 3. Se deu tudo certo, salvamos a Pulseira VIP (Token) no navegador
      localStorage.setItem("token", data.access_token);
      
      // 4. Redirecionamos para o Dashboard!
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-4">
      
      {/* Título Estilizado com Gradiente */}
      <div className="mb-8 text-center animate-fade-in-down">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-sky-300 drop-shadow-lg mb-2">
          To-do List
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">
          Organize sua vida. Conquiste seu dia.
        </p>
      </div>

      <div className="w-full max-w-md p-10 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Bem-vindo de volta</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Faça login para acessar suas tarefas
        </p>
        
        {/* Adicionamos a função no onSubmit do form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm text-slate-300">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza a memória
              required
              className="w-full p-3 bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="seu@email.com" 
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-slate-300">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza a memória
              required
              className="w-full p-3 bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-slate-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
