import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      onSuccess?.();
    } catch (loginError) {
      console.error(loginError);
      setError('Impossible de se connecter. Vérifiez vos identifiants.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900/70 backdrop-blur rounded-2xl p-8 shadow-2xl border border-cyan-500/30"
      >
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">BPI Control Center</h1>
        <p className="text-sm text-slate-300 mb-8 text-center">
          Connectez-vous avec votre compte administrateur pour piloter votre Banana Pi F3.
        </p>
        <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="email">
          Adresse e-mail
        </label>
        <input
          id="email"
          className="w-full rounded-lg bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:ring focus:ring-cyan-500/20 text-white px-4 py-2 mb-4"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
        />
        <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          className="w-full rounded-lg bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:ring focus:ring-cyan-500/20 text-white px-4 py-2 mb-6"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg py-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
