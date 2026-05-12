import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Lock, Save, RotateCcw, LogOut, Calendar, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DebtStrategyTips } from '@/components/DebtStrategyTips';
import {
  personalBanks,
  hipotecarioBanks,
  BankRate,
  saveRates,
  resetRates,
  getRatesLastUpdated,
  getDynamicPersonalBanks,
  getDynamicHipotecarioBanks,
} from '@/data/banks';

function formatDate(iso: string | null): string {
  if (!iso) return 'Nunca actualizado';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rg_admin_auth') === '1');
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [personal, setPersonal] = useState<BankRate[]>([]);
  const [hipotecario, setHipotecario] = useState<BankRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authed) {
      setPersonal(getDynamicPersonalBanks().map(b => ({ ...b })));
      setHipotecario(getDynamicHipotecarioBanks().map(b => ({ ...b })));
      setLastUpdated(getRatesLastUpdated());
    }
  }, [authed]);

  // Verificación server-side — la contraseña nunca se expone en el bundle del cliente
  const login = async () => {
    setLoginLoading(true);
    setPwError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('rg_admin_auth', '1');
        setAuthed(true);
      } else {
        setPwError(data.error || 'Contraseña incorrecta.');
      }
    } catch {
      setPwError('Error de conexión. Intentá nuevamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('rg_admin_auth');
    setAuthed(false);
    setPassword('');
  };

  const handleSave = () => {
    saveRates(personal, hipotecario);
    setLastUpdated(getRatesLastUpdated());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar las tasas por defecto? Se perderán los cambios guardados.')) {
      resetRates();
      setPersonal(personalBanks.map(b => ({ ...b })));
      setHipotecario(hipotecarioBanks.map(b => ({ ...b })));
      setLastUpdated(null);
    }
  };

  const updatePersonal = (i: number, field: 'tna' | 'cft', val: string) => {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setPersonal(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: n } : b));
  };

  const updateHipotecario = (i: number, field: 'tna' | 'cft', val: string) => {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setHipotecario(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: n } : b));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Shield size={20} className="text-teal-400" />
            </div>
            <div>
              <h1 className="text-white font-black">Panel Admin</h1>
              <p className="text-white/40 text-xs">Actualización de tasas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/60 mb-1.5">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-teal-500"
              />
            </div>
            {pwError && (
              <p className="text-rose-400 text-xs flex items-center gap-1">
                <Lock size={11} /> {pwError}
              </p>
            )}
            <Button onClick={login} disabled={loginLoading} className="w-full bg-teal-500 hover:bg-teal-400 font-bold">
              {loginLoading ? 'Verificando...' : 'Ingresar'}
            </Button>
          </div>

          <Link href="/" className="flex items-center gap-1.5 text-white/30 text-xs mt-6 hover:text-white/50 transition-colors">
            <ArrowLeft size={12} /> Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  const thClass = 'text-left text-xs font-bold text-slate-500 uppercase tracking-wide py-2 px-3';
  const tdClass = 'py-2 px-3';
  const numInputClass = 'h-8 w-24 text-sm text-right bg-slate-50 border-slate-200 focus-visible:ring-teal-400 rounded-lg';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-teal-400" />
            <span className="font-black text-sm">Panel de Administración</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs gap-1.5">
                <ArrowLeft size={13} /> Ver sitio
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white/60 hover:text-white text-xs gap-1.5">
              <LogOut size={13} /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Status bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-teal-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">Última actualización de tasas</p>
              <p className="text-xs text-slate-500">{formatDate(lastUpdated)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 size={16} /> ¡Guardado!
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1.5 border-slate-300 text-slate-600 hover:border-rose-300 hover:text-rose-600"
            >
              <RotateCcw size={13} /> Restaurar defaults
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5"
            >
              <Save size={13} /> Guardar tasas
            </Button>
          </div>
        </div>

        {/* Personal banks */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-800">Préstamos Personales</h2>
            <p className="text-xs text-slate-400 mt-0.5">TNA y CFT para préstamos personales. Modificá los valores y guardá.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={thClass}>Banco</th>
                  <th className={`${thClass} text-right`}>TNA %</th>
                  <th className={`${thClass} text-right`}>CFT %</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((bank, i) => (
                  <tr key={bank.name} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className={`${tdClass} font-semibold text-slate-800 text-sm`}>
                      <span className="inline-block w-9 text-center text-xs font-black text-teal-600 bg-teal-50 border border-teal-100 rounded-md py-0.5 mr-2">
                        {bank.logo}
                      </span>
                      {bank.name}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="999"
                        value={bank.tna}
                        onChange={e => updatePersonal(i, 'tna', e.target.value)}
                        className={numInputClass}
                      />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="999"
                        value={bank.cft}
                        onChange={e => updatePersonal(i, 'cft', e.target.value)}
                        className={numInputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hipotecario banks */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-800">Créditos Hipotecarios (UVA)</h2>
            <p className="text-xs text-slate-400 mt-0.5">TNA y CFT sobre UVA para créditos hipotecarios.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={thClass}>Banco</th>
                  <th className={`${thClass} text-right`}>TNA s/UVA %</th>
                  <th className={`${thClass} text-right`}>CFT s/UVA %</th>
                </tr>
              </thead>
              <tbody>
                {hipotecario.map((bank, i) => (
                  <tr key={bank.name} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className={`${tdClass} font-semibold text-slate-800 text-sm`}>
                      <span className="inline-block w-9 text-center text-xs font-black text-teal-600 bg-teal-50 border border-teal-100 rounded-md py-0.5 mr-2">
                        {bank.logo}
                      </span>
                      {bank.name}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="99"
                        value={bank.tna}
                        onChange={e => updateHipotecario(i, 'tna', e.target.value)}
                        className={numInputClass}
                      />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="99"
                        value={bank.cft}
                        onChange={e => updateHipotecario(i, 'cft', e.target.value)}
                        className={numInputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Save button bottom */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 px-8"
          >
            <Save size={16} /> Guardar todos los cambios
          </Button>
        </div>

        {/* Sección de estrategias — referencia interna */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-black text-xs">★</span>
            </div>
            <h2 className="text-base font-bold text-slate-800">Estrategias de referencia (solo admin)</h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Interno</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Este contenido es solo para tu revisión. No se muestra a los clientes.
          </p>
          <DebtStrategyTips />
        </div>
      </main>
    </div>
  );
}
