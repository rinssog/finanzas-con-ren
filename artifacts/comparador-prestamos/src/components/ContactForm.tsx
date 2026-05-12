import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WA = '5491140353764';

const OBJECTIVES = [
  'Quiero invertir mis ahorros',
  'Necesito un seguro de vida',
  'Busco un seguro de ahorro / retiro',
  'Quiero proteger mi empresa o bienes',
  'Necesito financiamiento para mi PyME',
  'Quiero acceder a garantías SGR',
  'Necesito ART para mi empresa o empleados',
  'Quiero armar un plan financiero completo',
  'Tengo deudas y necesito organizarme',
  'Otro / quiero contarle más detalles',
];

const INCOME_RANGES = [
  'Prefiero no indicar',
  'Menos de $500.000 / mes',
  '$500.000 – $1.000.000 / mes',
  '$1.000.000 – $3.000.000 / mes',
  '$3.000.000 – $5.000.000 / mes',
  'Más de $5.000.000 / mes',
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  income: string;
  familyStatus: string;
  hasKids: string;
  situation: string;
  objective: string;
  contactPreference: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', occupation: '',
    income: '', familyStatus: '', hasKids: '',
    situation: '', objective: '', contactPreference: 'WhatsApp',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.objective || !form.occupation.trim()) {
      setError('Completá al menos nombre, ocupación y objetivo de la consulta.');
      return;
    }
    setError('');

    const lines = [
      `👋 Hola Renzo, me contacto desde tu web personal.`,
      ``,
      `*Datos personales*`,
      `• Nombre: ${form.name}`,
      form.phone ? `• Teléfono: ${form.phone}` : null,
      form.email ? `• Email: ${form.email}` : null,
      `• Ocupación: ${form.occupation}`,
      form.income && form.income !== 'Prefiero no indicar' ? `• Ingresos aprox.: ${form.income}` : null,
      form.familyStatus ? `• Estado civil: ${form.familyStatus}` : null,
      form.hasKids ? `• Hijos: ${form.hasKids}` : null,
      ``,
      `*Objetivo de la consulta*`,
      `• ${form.objective}`,
      form.situation ? `• Detalle: ${form.situation}` : null,
      ``,
      `• Prefiero ser contactado por: ${form.contactPreference}`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank');
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900">¡Listo! Te redirigimos a WhatsApp</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          Tu consulta quedó armada. Si el mensaje no se abrió, hacé click abajo.
        </p>
        <button onClick={() => setSent(false)} className="text-teal-600 text-sm font-semibold hover:underline mt-2">
          Enviar otra consulta
        </button>
      </motion.div>
    );
  }

  const labelClass = 'block text-xs font-bold text-slate-700 mb-1.5';
  const inputClass = 'h-10 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-400';
  const selectClass =
    'w-full h-10 text-sm rounded-xl border border-slate-200 bg-white px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre completo *</label>
          <Input value={form.name} onChange={set('name')} placeholder="Ej: Martina López" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <Input value={form.phone} onChange={set('phone')} placeholder="Ej: 11 5555-1234" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <Input type="email" value={form.email} onChange={set('email')} placeholder="tucorreo@mail.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ocupación / Actividad *</label>
          <Input value={form.occupation} onChange={set('occupation')} placeholder="Ej: Contador, Empleado, Dueño de PyME" className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Ingresos mensuales <span className="font-normal text-slate-400">(opcional)</span></label>
          <div className="relative">
            <select value={form.income} onChange={set('income')} className={selectClass}>
              <option value="">Seleccioná</option>
              {INCOME_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Estado civil</label>
          <div className="relative">
            <select value={form.familyStatus} onChange={set('familyStatus')} className={selectClass}>
              <option value="">Seleccioná</option>
              {['Soltero/a', 'En pareja', 'Casado/a', 'Divorciado/a', 'Viudo/a'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>¿Tenés hijos?</label>
          <div className="relative">
            <select value={form.hasKids} onChange={set('hasKids')} className={selectClass}>
              <option value="">Seleccioná</option>
              {['Sin hijos', '1 hijo/a', '2 hijos/as', '3 o más hijos/as'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>¿Cuál es tu objetivo principal? *</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {OBJECTIVES.map(obj => (
            <button
              key={obj}
              type="button"
              onClick={() => setForm(f => ({ ...f, objective: obj }))}
              className={`text-left text-xs px-3 py-2.5 rounded-xl border-2 font-medium transition-all ${
                form.objective === obj
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-teal-50/50'
              }`}
            >
              {form.objective === obj && <span className="text-teal-500 mr-1">✓</span>}
              {obj}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Contame más sobre tu situación <span className="font-normal text-slate-400">(opcional)</span></label>
        <textarea
          value={form.situation}
          onChange={set('situation')}
          rows={3}
          placeholder="Describí tu situación actual, qué querés lograr, qué dudas tenés..."
          className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className={labelClass}>¿Cómo preferís que te contacte?</label>
        <div className="flex gap-2 flex-wrap">
          {['WhatsApp', 'Email', 'Videollamada', 'Llamada telefónica'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setForm(f => ({ ...f, contactPreference: opt }))}
              className={`text-xs px-4 py-2 rounded-full border-2 font-semibold transition-all ${
                form.contactPreference === opt
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl py-5 text-sm">
        <Send size={15} /> Enviar consulta por WhatsApp
      </Button>
      <p className="text-xs text-center text-slate-400">
        Tu información es confidencial. Se abrirá WhatsApp con tu consulta ya armada.
      </p>
    </form>
  );
}
