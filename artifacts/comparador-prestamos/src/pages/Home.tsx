import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  TrendingUp, Shield, PiggyBank, Building2, Heart, BarChart3,
  Instagram, Youtube, Linkedin, MessageCircle, ExternalLink,
  ChevronRight, Star, Calculator, ArrowRight, BookOpen,
  Briefcase, Scale, Users, Globe, Factory, CheckCircle2,
  AlertCircle, Send, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WA = '5491140353764';

// ─── Services ─────────────────────────────────────────────────────────────────

const PERSONAL_SERVICES = [
  {
    icon: <TrendingUp size={22} />,
    color: 'text-teal-600 bg-teal-50 border-teal-100',
    title: 'Inversiones Nacionales',
    desc: 'Portafolios en pesos con enfoque en fundamentos. CEDEARs, bonos soberanos, FCI y acciones argentinas seleccionadas.',
    tags: ['CEDEARs', 'Bonos', 'FCI', 'Acciones'],
  },
  {
    icon: <Globe size={22} />,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    title: 'Inversiones Internacionales',
    desc: 'Acceso al mercado global en dólares. ETFs, acciones extranjeras y fondos del exterior para diversificar tu patrimonio.',
    tags: ['ETFs', 'Acciones USA', 'Fondos', 'Dólares'],
  },
  {
    icon: <Heart size={22} />,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    title: 'Seguro de Vida + Enfermedades Graves',
    desc: 'Protegé a tu familia ante fallecimiento e invalidez. Coberturas que también incluyen diagnóstico de enfermedades graves como cáncer, ACV o infarto.',
    tags: ['Vida entera', 'Temporal', 'Enfermedades graves', 'Invalidez'],
  },
  {
    icon: <PiggyBank size={22} />,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    title: 'Seguro de Ahorro y Retiro',
    desc: 'Ahorrá con estructura, disciplina y rentabilidad. Instrumentos que combinan protección y crecimiento de capital a largo plazo.',
    tags: ['Plan de retiro', 'Educativo', 'Dolarizado', 'Flexible'],
  },
  {
    icon: <Shield size={22} />,
    color: 'text-violet-600 bg-violet-50 border-violet-100',
    title: 'Seguros Patrimoniales',
    desc: 'Protegé tu auto, comercio, hogar y bienes. Coberturas completas para personas y empresas con las mejores aseguradoras del mercado.',
    tags: ['Auto', 'Hogar', 'Comercio', 'RC'],
  },
  {
    icon: <Scale size={22} />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    title: 'Planificación Financiera',
    desc: 'Abogado y planificador financiero en un solo asesor. Estructurá ingresos, gastos y patrimonio con una visión legal e integral.',
    tags: ['Presupuesto', 'Patrimonio', 'Legal', 'Retiro'],
  },
];

const BUSINESS_SERVICES = [
  {
    icon: <Building2 size={22} />,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    title: 'Financiamiento para PyMEs',
    desc: 'Acceso a líneas de crédito blando, capital de trabajo y financiamiento productivo para hacer crecer tu empresa.',
    tags: ['Capital de trabajo', 'Inversión', 'Líneas blandas'],
  },
  {
    icon: <Factory size={22} />,
    color: 'text-orange-600 bg-orange-50 border-orange-100',
    title: 'SGR — Garantías para PyMEs',
    desc: 'Accedé a créditos bancarios con avales de Sociedades de Garantía Recíproca. Reducís el costo financiero y accedés a mejores tasas.',
    tags: ['Avales', 'SGR', 'Tasas preferenciales', 'Bancos'],
  },
  {
    icon: <Users size={22} />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    title: 'ART — Riesgos del Trabajo',
    desc: 'Aseguradoras de riesgos del trabajo para empleadores y trabajadores autónomos. Cumplí la ley y protegé a tu equipo.',
    tags: ['Empresas', 'Monotributistas', 'Empleados', 'Personal'],
  },
];

const SOCIALS = [
  { icon: <Instagram size={20} />, label: 'Instagram', handle: '@finanzasconren', url: 'https://www.instagram.com/finanzasconren', color: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600' },
  { icon: <Youtube size={20} />, label: 'YouTube', handle: '@Finanzasconren', url: 'https://www.youtube.com/@Finanzasconren', color: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', handle: 'Renzo Grecco', url: 'https://www.linkedin.com/in/renzo-grecco', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' },
  { icon: <MessageCircle size={20} />, label: 'WhatsApp', handle: 'Consultá gratis', url: `https://wa.me/${WA}`, color: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600' },
];

const TOOLS = [
  { icon: <Calculator size={18} />, title: 'Comparador de Préstamos', desc: '14 bancos. Tasas reales, cuotas y amortización.', href: '/herramientas', badge: 'Más usado' },
  { icon: <BarChart3 size={18} />, title: 'Analizador de Tarjetas', desc: 'Importá tu resumen PDF y eliminá tu deuda inteligentemente.', href: '/herramientas/tarjetas', badge: 'Nuevo' },
];

// ─── Contact form ──────────────────────────────────────────────────────────────

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

function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', occupation: '',
    income: '', familyStatus: '', hasKids: '',
    situation: '', objective: '', contactPreference: 'WhatsApp',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900">¡Listo! Te redirigimos a WhatsApp</h3>
        <p className="text-slate-500 text-sm max-w-xs">Tu consulta quedó armada. Si el mensaje no se abrió, hacé click abajo.</p>
        <button onClick={() => setSent(false)} className="text-teal-600 text-sm font-semibold hover:underline mt-2">Enviar otra consulta</button>
      </motion.div>
    );
  }

  const labelClass = 'block text-xs font-bold text-slate-700 mb-1.5';
  const inputClass = 'h-10 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-400';
  const selectClass = 'w-full h-10 text-sm rounded-xl border border-slate-200 bg-white px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Personal */}
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

      {/* Financial profile */}
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

      {/* Objective */}
      <div>
        <label className={labelClass}>¿Cuál es tu objetivo principal? *</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {OBJECTIVES.map(obj => (
            <button key={obj} type="button"
              onClick={() => setForm(f => ({ ...f, objective: obj }))}
              className={`text-left text-xs px-3 py-2.5 rounded-xl border-2 font-medium transition-all ${form.objective === obj
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-teal-50/50'}`}>
              {form.objective === obj && <span className="text-teal-500 mr-1">✓</span>}
              {obj}
            </button>
          ))}
        </div>
      </div>

      {/* Situation detail */}
      <div>
        <label className={labelClass}>Contame más sobre tu situación <span className="font-normal text-slate-400">(opcional)</span></label>
        <textarea value={form.situation} onChange={set('situation')}
          rows={3} placeholder="Describí tu situación actual, qué querés lograr, qué dudas tenés... Cuanto más me contés, mejor te puedo ayudar."
          className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700 placeholder:text-slate-400" />
      </div>

      {/* Contact preference */}
      <div>
        <label className={labelClass}>¿Cómo preferís que te contacte?</label>
        <div className="flex gap-2 flex-wrap">
          {['WhatsApp', 'Email', 'Videollamada', 'Llamada telefónica'].map(opt => (
            <button key={opt} type="button"
              onClick={() => setForm(f => ({ ...f, contactPreference: opt }))}
              className={`text-xs px-4 py-2 rounded-full border-2 font-semibold transition-all ${form.contactPreference === opt
                ? 'border-teal-500 bg-teal-500 text-white'
                : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}>
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
      <p className="text-xs text-center text-slate-400">Tu información es confidencial. Se abrirá WhatsApp con tu consulta ya armada.</p>
    </form>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/renzo-hero.png" alt="Renzo Grecco" className="w-9 h-9 rounded-xl object-cover object-top" />
          <div>
            <span className="text-white font-black text-base leading-none tracking-tight">Finanzas</span>
            <span className="text-teal-400 font-black text-base leading-none tracking-tight"> con Ren</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Servicios', href: '#servicios' },
            { label: 'Empresas', href: '#empresas' },
            { label: 'Herramientas', href: '#herramientas' },
            { label: 'Sobre mí', href: '#sobre-mi' },
            { label: 'Contacto', href: '#contacto' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="text-sm font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              {item.label}
            </a>
          ))}
        </nav>
        <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5 rounded-xl">
            <MessageCircle size={13} /> Contactar
          </Button>
        </a>
      </div>
    </header>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  useEffect(() => { document.title = 'Renzo Grecco — Finanzas con Ren'; }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative overflow-hidden bg-slate-950 pt-32 pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* Photo */}
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}
              className="shrink-0">
              <div className="relative">
                <div className="w-52 h-64 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shadow-black/60">
                  <img src="/renzo-hero.png" alt="Renzo Grecco" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xl">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <div>
                    <p className="text-white text-xs font-black leading-none">Grupo Abax</p>
                    <p className="text-white/40 text-xs leading-none mt-0.5">Asesor principal</p>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-teal-500 rounded-2xl px-3 py-2 shadow-xl shadow-teal-900/40">
                  <p className="text-white text-xs font-black leading-none">Abogado &amp;</p>
                  <p className="text-white/80 text-xs leading-none mt-0.5">Plan. Financiero</p>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
              className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/20 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Briefcase size={12} /> Inversiones · Seguros · Finanzas · PyMEs
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.0] tracking-tight mb-4">
                Renzo<br />
                <span className="text-teal-400">Grecco</span>
              </h1>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                Te ayudo a tomar mejores decisiones financieras con información clara, estrategias reales y las herramientas que necesitás para proteger y hacer crecer tu patrimonio.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#contacto">
                  <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl px-6 py-5">
                    Consultá gratis <ArrowRight size={15} />
                  </Button>
                </a>
                <a href="#servicios">
                  <Button variant="outline" className="border-white/15 text-white hover:bg-white/5 gap-2 rounded-xl px-6 py-5">
                    Ver servicios
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-16 border-t border-white/5 pt-10">
            {[
              { value: '+500', label: 'Clientes asesorados' },
              { value: '15+', label: 'Aseguradoras' },
              { value: 'SGR', label: 'Garantías para PyMEs' },
              { value: '3 en 1', label: 'Derecho · Finanzas · Seguros' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 tabular-nums">{stat.value}</div>
                <div className="text-white/35 text-xs sm:text-sm mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sobre mí ──────────────────────────────────────────────────────────── */}
      <section id="sobre-mi" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo col */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img src="/renzo-uba.jpeg" alt="Renzo Grecco frente a la UBA" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                    <Scale size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Abogado (UBA)</p>
                    <p className="text-white/50 text-xs">Planificador Financiero · Grupo Abax</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text col */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
                <Users size={12} /> Sobre mí
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
                Derecho, finanzas y seguros<br />
                <span className="text-teal-600">en un solo asesor</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Soy <strong className="text-slate-900">abogado y planificador financiero</strong>. Esa combinación me permite asesorarte con una visión integral que va mucho más allá de los números: estructuramos tu patrimonio, tus inversiones y tu protección con respaldo legal.
                </p>
                <p>
                  Lidero un equipo en <strong className="text-slate-900">Grupo Abax</strong> con soluciones en inversiones nacionales e internacionales, financiamiento para PyMEs, garantías SGR, seguros de vida, ahorro, patrimoniales y ART.
                </p>
                <p>
                  A través de <strong className="text-teal-600">@finanzasconren</strong> comparto contenido educativo gratuito para ayudar a más personas a tomar decisiones inteligentes con su dinero.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Abogado', 'Plan. Financiero', 'Broker de Seguros', 'Grupo Abax', 'Finanzas PyMEs', 'SGR'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <a href="#contacto" className="inline-block mt-6">
                <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl">
                  <MessageCircle size={14} /> Hablar con Renzo
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Servicios personales ───────────────────────────────────────────────── */}
      <section id="servicios" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
              <Briefcase size={12} /> Personas y familias
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Servicios personales</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Soluciones financieras y de protección diseñadas a medida para cada etapa de tu vida.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAL_SERVICES.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border-2 border-slate-100 hover:border-teal-100 p-6 shadow-sm hover:shadow-lg transition-all group">
                <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center mb-4 ${s.color} group-hover:scale-105 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="font-black text-slate-900 text-sm mb-2">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Servicios empresas ────────────────────────────────────────────────── */}
      <section id="empresas" className="py-20 px-4 sm:px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 mb-4">
                <Factory size={12} /> PyMEs y empresas
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Servicios empresariales</h2>
              <p className="text-white/45 text-sm max-w-md">Financiamiento, garantías y protección para hacer crecer tu negocio.</p>
            </div>
            <img src="/renzo-suit.jpeg" alt="Renzo Grecco traje" className="w-28 h-36 rounded-2xl object-cover object-top border-2 border-white/10 shadow-xl shrink-0 hidden md:block" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {BUSINESS_SERVICES.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 hover:border-teal-400/30 hover:bg-white/8 rounded-2xl p-6 transition-all group">
                <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center mb-4 ${s.color} group-hover:scale-105 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">¿Tu empresa necesita financiamiento o garantías SGR?</p>
              <p className="text-white/45 text-xs">Evaluamos tu caso sin costo y te conectamos con las mejores opciones del mercado.</p>
            </div>
            <a href="#contacto">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5 rounded-xl whitespace-nowrap">
                <ChevronRight size={13} /> Consultar ahora
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Herramientas ──────────────────────────────────────────────────────── */}
      <section id="herramientas" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
              <Calculator size={12} /> Herramientas gratuitas
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              ComparaYa — calculadoras<br className="hidden sm:block" /> financieras para Argentina
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
              Tomá decisiones con información real. Sin letra chica, sin publicidad, sin costo.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={tool.href}>
                  <div className="bg-white border-2 border-slate-100 hover:border-teal-100 hover:shadow-lg rounded-2xl p-6 cursor-pointer transition-all group shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:scale-110 group-hover:bg-teal-100 transition-all">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-full">{tool.badge}</span>
                    </div>
                    <h3 className="text-slate-900 font-bold text-base mb-1.5">{tool.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-teal-600 text-xs font-bold group-hover:gap-2.5 transition-all">
                      Abrir herramienta <ChevronRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 font-bold text-sm mb-0.5">¿Necesitás interpretar los resultados?</p>
              <p className="text-slate-500 text-xs">Las herramientas son orientativas. Para una estrategia personalizada, hablemos directamente.</p>
            </div>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5 rounded-xl whitespace-nowrap">
                <MessageCircle size={12} /> Consultar
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Redes ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Seguime en redes</h2>
            <p className="text-slate-400 text-sm">Contenido gratuito sobre finanzas, inversiones y seguros para el contexto argentino.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIALS.map((s, i) => (
              <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`flex flex-col items-center gap-3 p-5 border-2 border-slate-100 rounded-2xl text-slate-600 transition-all cursor-pointer ${s.color}`}>
                <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center">{s.icon}</div>
                <div className="text-center">
                  <p className="font-bold text-sm">{s.label}</p>
                  <p className="text-xs opacity-60">{s.handle}</p>
                </div>
                <ExternalLink size={11} className="opacity-30" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto (formulario) ─────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 items-start">

            {/* Left: info + photo */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
                  <MessageCircle size={12} /> Contacto
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">
                  Contame tu situación
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Cuanto más me contés, mejor puedo ayudarte. Con esta info armo una consulta personalizada antes de hablar con vos.
                </p>
              </div>

              <img src="/renzo-evento.jpeg" alt="Renzo Grecco" className="w-full rounded-2xl object-cover object-top aspect-[4/5] shadow-lg" />

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contacto directo</p>
                {[
                  { icon: <MessageCircle size={13} className="text-emerald-500" />, label: 'WhatsApp', val: '+54 9 11 4035-3764', href: `https://wa.me/${WA}` },
                  { icon: <Instagram size={13} className="text-pink-500" />, label: 'Instagram', val: '@finanzasconren', href: 'https://www.instagram.com/finanzasconren' },
                  { icon: <Linkedin size={13} className="text-blue-500" />, label: 'LinkedIn', val: 'Renzo Grecco', href: 'https://www.linkedin.com/in/renzo-grecco' },
                ].map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 py-1 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.val}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-slate-900 mb-1">Formulario de consulta</h3>
              <p className="text-slate-400 text-xs mb-6">Respondé lo que puedas — todo dato me ayuda a preparar mejor la charla.</p>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 py-10 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <img src="/renzo-hero.png" alt="Renzo" className="w-9 h-9 rounded-xl object-cover object-top" />
            <div>
              <p className="text-white font-black text-sm leading-none">Finanzas con Ren</p>
              <p className="text-white/35 text-xs mt-0.5">Renzo Grecco · Grupo Abax</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[
              { icon: <Instagram size={15} />, url: 'https://www.instagram.com/finanzasconren' },
              { icon: <Youtube size={15} />, url: 'https://www.youtube.com/@Finanzasconren' },
              { icon: <Linkedin size={15} />, url: 'https://www.linkedin.com/in/renzo-grecco' },
              { icon: <MessageCircle size={15} />, url: `https://wa.me/${WA}` },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-teal-400 transition-colors">{s.icon}</a>
            ))}
          </div>
          <p className="text-white/25 text-xs">Abogado · Planificador Financiero · Broker de Seguros</p>
        </div>
      </footer>
    </div>
  );
}
