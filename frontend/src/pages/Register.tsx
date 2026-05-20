import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // O backend espera { name, email, password }
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao registrar");
      }

      // Agora o backend devolve o token no cadastro, então nós salvamos:
      localStorage.setItem("token", data.access_token);

      // E vamos direto para o Dashboard!
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full max-w-md p-10 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Criar Conta</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Registre-se para começar a usar
        </p>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm text-slate-300">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Seu nome" 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-slate-400">
          Já possui uma conta?{' '}
          <Link to="/" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
