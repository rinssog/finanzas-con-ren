import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  TrendingUp, Shield, PiggyBank, Building2, Heart, BarChart3,
  Instagram, Youtube, Linkedin, MessageCircle, ExternalLink,
  ChevronRight, Star, Calculator, ArrowRight, BookOpen,
  Briefcase, Scale, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: <TrendingUp size={22} />,
    color: 'text-teal-600 bg-teal-50 border-teal-100',
    title: 'Inversiones',
    desc: 'Estrategias racionales, alejadas del ruido mediático. Portafolios diseñados para tu perfil de riesgo y horizonte temporal.',
    tags: ['CEDEARs', 'Bonos', 'FCI', 'Acciones'],
  },
  {
    icon: <Heart size={22} />,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    title: 'Seguro de Vida',
    desc: 'Protegé a tu familia ante imprevistos. Coberturas diseñadas para cubrir deudas, gastos familiares y pérdida de ingresos.',
    tags: ['Vida entera', 'Temporal', 'Con ahorro'],
  },
  {
    icon: <PiggyBank size={22} />,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    title: 'Seguro de Ahorro',
    desc: 'Ahorrá con estructura y rentabilidad. Instrumentos que combinan protección y crecimiento de capital a largo plazo.',
    tags: ['Plan de retiro', 'Educativo', 'Flexible'],
  },
  {
    icon: <Shield size={22} />,
    color: 'text-violet-600 bg-violet-50 border-violet-100',
    title: 'Patrimoniales',
    desc: 'Protegé tu auto, comercio, hogar y bienes. Coberturas completas para personas y empresas con las mejores aseguradoras.',
    tags: ['Auto', 'Hogar', 'Comercio', 'RC'],
  },
  {
    icon: <Building2 size={22} />,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    title: 'ART',
    desc: 'Aseguradoras de riesgos del trabajo para empleadores y trabajadores independientes. Cumplí la ley y protegé tu equipo.',
    tags: ['Empresas', 'Monotributistas', 'Personal'],
  },
  {
    icon: <Scale size={22} />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    title: 'Planificación Financiera',
    desc: 'Como abogado y planificador financiero, te ayudo a estructurar ingresos, gastos y patrimonio con una visión legal y financiera integrada.',
    tags: ['Presupuesto', 'Patrimonio', 'Retiro'],
  },
];

const SOCIALS = [
  { icon: <Instagram size={20} />, label: 'Instagram', handle: '@finanzasconren', url: 'https://www.instagram.com/finanzasconren', color: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600' },
  { icon: <Youtube size={20} />, label: 'YouTube', handle: '@Finanzasconren', url: 'https://www.youtube.com/@Finanzasconren', color: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', handle: 'Renzo Grecco', url: 'https://www.linkedin.com/in/renzo-grecco', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' },
  { icon: <MessageCircle size={20} />, label: 'WhatsApp', handle: 'Consultá gratis', url: 'https://wa.me/5491100000000', color: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600' },
];

const TOOLS = [
  { icon: <Calculator size={18} />, title: 'Comparador de Préstamos', desc: '14 bancos. Tasas reales, cuotas y amortización.', href: '/herramientas', badge: 'Más usado' },
  { icon: <BarChart3 size={18} />, title: 'Analizador de Tarjetas', desc: 'Importá tu resumen PDF y eliminá tu deuda inteligentemente.', href: '/herramientas/tarjetas', badge: 'Nuevo' },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">RG</span>
          </div>
          <div>
            <span className="text-white font-black text-base leading-none tracking-tight">Finanzas</span>
            <span className="text-teal-400 font-black text-base leading-none tracking-tight"> con Ren</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Inicio', href: '#inicio' },
            { label: 'Servicios', href: '#servicios' },
            { label: 'Herramientas', href: '#herramientas' },
            { label: 'Sobre mí', href: '#sobre-mi' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="text-sm font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5 rounded-xl">
            <MessageCircle size={13} /> Contactar
          </Button>
        </a>
      </div>
    </header>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  useEffect(() => { document.title = 'Renzo Grecco — Finanzas con Ren'; }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative overflow-hidden bg-slate-950 pt-32 pb-24 px-4 sm:px-6">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Avatar */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="shrink-0">
              <div className="relative">
                <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 flex items-center justify-center shadow-2xl shadow-teal-900/60 border-4 border-white/10">
                  <span className="text-white font-black text-6xl tracking-tighter">RG</span>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-slate-900 border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-xl">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">Grupo Abax</span>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/20 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Briefcase size={12} /> Abogado · Planificador Financiero · Broker de Seguros
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4">
                Renzo<br />
                <span className="text-teal-400">Grecco</span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                Te ayudo a tomar mejores decisiones financieras con información clara, estrategias reales y las herramientas que necesitás para proteger y hacer crecer tu patrimonio.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#servicios">
                  <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl px-6">
                    Ver servicios <ArrowRight size={15} />
                  </Button>
                </a>
                <Link href="/herramientas">
                  <Button variant="outline" className="border-white/15 text-white hover:bg-white/5 gap-2 rounded-xl px-6">
                    <Calculator size={15} /> Herramientas gratis
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-3 gap-4 mt-14 border-t border-white/5 pt-10">
            {[
              { value: '+500', label: 'Clientes asesorados' },
              { value: '15+', label: 'Aseguradoras' },
              { value: '3 en 1', label: 'Derecho · Finanzas · Seguros' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 tabular-nums">{stat.value}</div>
                <div className="text-white/40 text-xs sm:text-sm mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sobre mí ──────────────────────────────────────────────────────── */}
      <section id="sobre-mi" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
                <Users size={12} /> Sobre mí
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
                Derecho y finanzas,<br />
                <span className="text-teal-600">juntos en un solo lugar</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Soy <strong className="text-slate-900">abogado y planificador financiero</strong>, lo que me permite abordar la situación económica de mis clientes con una visión integral que va más allá de los números.
                </p>
                <p>
                  Lidero un equipo de asesores especializados en <strong className="text-slate-900">Grupo Abax</strong>, donde brindamos soluciones en inversiones, vida, ahorro, patrimoniales y ART para personas, familias y empresas de todo el país.
                </p>
                <p>
                  A través de <strong className="text-teal-600">@finanzasconren</strong> comparto contenido educativo sobre finanzas personales, inversiones y protección financiera para ayudar a más personas a tomar decisiones inteligentes con su dinero.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Abogado', 'Planificador Financiero', 'Broker de Seguros', 'Grupo Abax', 'Educador Financiero'].map(tag => (
                  <span key={tag} className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="space-y-4">
              {[
                { icon: <Scale size={16} />, color: 'bg-blue-500', title: 'Formación legal', desc: 'Abogado con especialización en derecho patrimonial y planificación sucesoria. Una perspectiva única para proteger tus activos.' },
                { icon: <TrendingUp size={16} />, color: 'bg-teal-500', title: 'Asesoramiento financiero', desc: 'Inversiones basadas en fundamentos, alejadas del ruido mediático. Enfoque de largo plazo para hacer crecer tu capital.' },
                { icon: <Shield size={16} />, color: 'bg-violet-500', title: 'Protección integral', desc: 'Más de 15 aseguradoras para encontrar la cobertura ideal para vos, tu familia y tu empresa a la mejor tasa del mercado.' },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 items-start shadow-sm">
                  <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center shrink-0 text-white`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Servicios ─────────────────────────────────────────────────────── */}
      <section id="servicios" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
              <Briefcase size={12} /> Servicios
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">¿En qué te puedo ayudar?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Soluciones financieras y de protección diseñadas a medida para cada etapa de tu vida.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border-2 border-slate-100 hover:border-teal-100 p-6 shadow-sm hover:shadow-lg transition-all group">
                <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center mb-4 ${s.color} group-hover:scale-105 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="font-black text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 text-center">
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl px-8 py-5 text-sm">
                <MessageCircle size={15} /> Consultá gratis por WhatsApp
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Herramientas ──────────────────────────────────────────────────── */}
      <section id="herramientas" className="py-20 px-4 sm:px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-bold bg-teal-400/10 px-3 py-1.5 rounded-full border border-teal-400/20 mb-4">
              <Calculator size={12} /> Herramientas gratuitas
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              ComparaYa — calculadoras<br className="hidden sm:block" /> financieras para Argentina
            </h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base">
              Tomé decisiones con información real. Sin letra chica, sin publicidad, sin costo.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={tool.href}>
                  <div className="bg-white/5 border border-white/10 hover:border-teal-400/30 hover:bg-white/8 rounded-2xl p-6 cursor-pointer transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-bold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2 py-1 rounded-full">{tool.badge}</span>
                    </div>
                    <h3 className="text-white font-bold text-base mb-1.5">{tool.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                      Abrir herramienta <ChevronRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-0.5">¿Necesitás interpretar los resultados?</p>
              <p className="text-white/50 text-xs">Las herramientas son orientativas. Para una estrategia personalizada, hablemos directamente.</p>
            </div>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs gap-1.5 rounded-xl whitespace-nowrap">
                <MessageCircle size={12} /> Consultar
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Contenido digital ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-slate-600 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 mb-4">
              <Instagram size={12} /> Contenido financiero
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Seguime en redes</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              Contenido gratuito sobre finanzas personales, inversiones y protección financiera para el contexto argentino.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIALS.map((s, i) => (
              <motion.a key={s.label}
                href={s.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`flex flex-col items-center gap-3 p-6 border-2 border-slate-100 rounded-2xl text-slate-600 transition-all cursor-pointer ${s.color}`}>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {s.icon}
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{s.label}</p>
                  <p className="text-xs opacity-70">{s.handle}</p>
                </div>
                <ExternalLink size={12} className="opacity-40" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">¿Empezamos?</h2>
            <p className="text-teal-100 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Una consulta gratuita puede cambiar cómo manejás tu dinero. Sin compromiso, sin letra chica.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-teal-700 hover:bg-teal-50 font-bold gap-2 rounded-xl px-8 py-5 text-sm shadow-xl">
                  <MessageCircle size={15} /> Hablar por WhatsApp
                </Button>
              </a>
              <a href="https://linktr.ee/Finanzasconren" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 rounded-xl px-8 py-5 text-sm">
                  <ExternalLink size={15} /> Todos mis links
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 py-8 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">RG</span>
            </div>
            <span className="font-semibold text-white/50">Renzo Grecco — Finanzas con Ren</span>
          </div>
          <span>Abogado · Planificador Financiero · Grupo Abax</span>
        </div>
      </footer>
    </div>
  );
}
