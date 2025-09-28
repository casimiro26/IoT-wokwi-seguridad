import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  type: 'login' | 'register';
  isOpen: boolean;
  onClose: () => void;
  onSwitchType: (type: 'login' | 'register') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ type, isOpen, onClose, onSwitchType }) => {
  const { login, register, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!minLength || !hasUpperCase || !hasNumber) {
      let message = 'La contraseña debe tener:';
      if (!minLength) message += ' al menos 8 caracteres,';
      if (!hasUpperCase) message += ' una mayúscula,';
      if (!hasNumber) message += ' un número,';
      setPasswordError(message.slice(0, -1) + '.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (type === 'register' && !validatePassword(formData.password)) {
      setLoading(false);
      return;
    }
    try {
      let success = false;
    
      if (type === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }
      if (success) {
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(type === 'login' ? 'Credenciales inválidas' : 'Error al crear la cuenta');
      }
    } catch (err) {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    }
 
    setLoading(false);
  };

  if (user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl transform animate-in slide-in-from-bottom-4 duration-300 flex" style={{ minHeight: '500px' }}>
          {/* Left Page (Cover with Background) */}
          <div className="w-1/2 bg-red-600 p-8 flex flex-col justify-between rounded-l-2xl" style={{ backgroundImage: 'url(https://example.com/robot-store-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="bg-black/50 p-6 rounded-lg">
              <h2 className="text-5xl font-bold text-white mb-4 animate-text-glow">Sr. Robot</h2>
              <p className="text-xl text-white animate-text-glow">Tu destino para tecnología de vanguardia en Huánuco, Perú. Descubre accesorios innovadores con envíos rápidos y soporte dedicado.</p>
            </div>
            <div className="text-right">
            </div>
          </div>
          {/* Right Page (Content) */}
          <div className="w-1/2 p-8 bg-gray-50 dark:bg-gray-700 rounded-r-2xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-7 h-7 text-gray-600 dark:text-gray-300 animate-text-glow" />
            </button>
            <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-6 animate-text-glow">¡Bienvenido a la tienda Sr. Robot, {user.name || user.email.split('@')[0]}!</h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-900 dark:text-gray-100 animate-text-glow">Tu cuenta está activa. Explora nuestra selección de productos.</p>
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-text-glow">Correo: <span className="font-medium">{user.email}</span></p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors text-xl animate-text-glow"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl transform animate-in slide-in-from-bottom-4 duration-300 flex" style={{ minHeight: '500px' }}>
        {/* Left Page (Cover) */}
        <div className="w-1/2 bg-red-600 text-white p-8 flex flex-col justify-between rounded-l-2xl" style={{ backgroundImage: 'url(https://example.com/robot-store-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div>
            <h2 className="text-5xl font-bold mb-6 animate-text-glow">Sr. Robot</h2>
            <p className="text-xl animate-text-glow">Únete a nuestra comunidad tecnológica</p>
          </div>
          <div className="text-right">
          </div>
        </div>
        {/* Right Page (Content) */}
        <div className="w-1/2 p-8 bg-gray-50 dark:bg-gray-700 rounded-r-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-gray-600 dark:text-gray-300 animate-text-glow" />
          </button>
          <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-8 animate-text-glow">
            {type === 'login' ? 'Iniciar Sesión' : 'Regístrate en Sr. Robot'}
          </h2>
          {type === 'login' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 mb-6">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Admin:</strong> admin@srrobot.com / SrRobot2024!
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {type === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (type === 'register') validatePassword(e.target.value);
                }}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
              {type === 'register' && passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (type === 'register' && !!passwordError)}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => onSwitchType(type === 'login' ? 'register' : 'login')}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-lg"
              >
                {type === 'login'
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};