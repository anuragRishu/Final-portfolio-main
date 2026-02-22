import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ShieldCheck } from 'lucide-react';

export default function PasswordModal({ 
  onSuccess, 
  onClose 
}: { 
  onSuccess: () => void; 
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-md relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
          <p className="text-white/40 text-sm">Please enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 px-6 focus:outline-none focus:border-indigo-500 transition-all text-center tracking-[0.5em]`}
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2 text-center font-medium"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Verify Identity
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
