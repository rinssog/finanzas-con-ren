import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  TrendingUp, Shield, PiggyBank, Building2, Heart, BarChart3,
  Instagram, Youtube, Linkedin, MessageCircle, ExternalLink,
  ChevronRight, Calculator, BookOpen, Briefcase, Scale,
  Users, Globe, Factory, CheckCircle2, Send, ChevronDown,
  CreditCard, AlertCircle, Lock, Calendar, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ContactForm } from '@/components/ContactForm';
import { getRatesLastUpdated } from '@/data/banks';
import { LoanType } from '@/data/banks';
import { AmortizationMethod } from '@/lib/calculations';

const WA = '5491140353764';

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
    desc: 'Protegé a tu familia ante fallecimiento e invalidez. Coberturas que también incluyen diagnóstico de enfermedades graves.',
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
    desc: 'Protegé tu auto, comercio, hogar y bienes. Coberturas completas para personas y empresas.',
    tags: ['Auto', 'Hogar', 'Comercio', 'RC'],
  },
  {
    icon: <Scale size={22} />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    title: 'Planificación Financiera',
    desc: 'Abogado y planificador financiero en un solo asesor. Estructurá ingresos, gastos y patrimonio con visión legal e integral.',
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
    title: 'ART — Seguros de Trabajo',
    desc: 'Cobertura de riesgos del trabajo para empleados y autónomos. Cumplimiento legal y protección real.',
    tags: ['ART', 'Empleados', 'Autónomos', 'Compliance'],
  },
];

const SOCIALS = [
  { icon: <Instagram size={20} />, label: 'Instagram', handle: '@finanzasconren', url: 'https://www.instagram.com/finanzasconren', color: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600' },
  { icon: <Youtube size={20} />, label: 'YouTube', handle: '@Finanzasconren', url: 'https://www.youtube.com/@Finanzasconren', color: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', handle: 'Renzo Grecco', url: 'https://www.linkedin.com/in/renzo-grecco', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' },
  { icon: <MessageCircle size={20} />, label: 'WhatsApp', handle: 'Consultá gratis', url: `https://wa.me/${WA}`, color: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600' },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

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
            { label: 'Calculadora', href: '#calculadora' },
            { label: 'Servicios', href: '#servicios' },
            { label: 'Sobre mí', href: '#sobre-mi' },
            { label: 'Contacto', href: '#contacto' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              {item.label}
            </a>
          ))}
          <Link href="/herramientas/tarjetas">
            <span className="flex items-center gap-1.5 text-sm font-medium text-teal-400 hover:text-teal-300 px-3 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
              <CreditCard size={13} /> Tarjetas
            </span>
          </Link>
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

// ─── Payment gate logic ───────────────────────────────────────────────────────

async function createMPPreference(loanType: LoanType, amount: number, months: number, method: AmortizationMethod) {
  localStorage.setItem('calculadora_params', JSON.stringify({ loanType, amount, months, method, timestamp: Date.now() }));

  const origin = window.location.origin;
  const res = await fetch('/api/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      successUrl: `${origin}/resultado`,
      failureUrl: `${origin}/resultado`,
      pendingUrl: `${origin}/resultado`,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData.error || 'No se pudo crear la preferencia de pago.';
    throw new Error(errMsg);
  }
  return res.json();
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const lastUpdated = getRatesLastUpdated();

  // Tab principal: tarjetas primero
  const [activeSection, setActiveSection] = useState<'tarjetas' | 'prestamos'>('tarjetas');

  // Calculator state
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [amount, setAmount] = useState<number>(5000000);
  const [months, setMonths] = useState<number>(24);
  const [method, setMethod] = useState<AmortizationMethod>('frances');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const handleCalcular = async () => {
    setPaying(true);
    setPayError('');
    try {
      const data = await createMPPreference(loanType, amount, months, method);
      const url = data.sandbox_init_point || data.init_point;
      if (!url) throw new Error('URL de pago no disponible.');
      window.location.href = url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado.';
      setPayError(msg);
      setPaying(false);
    }
  };

  return (
    <div className="bg-white text-slate-900">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-bold bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20 mb-5">
              <Calculator size={12} /> Calculadora de Préstamos y Deudas
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Calculá tus deudas.<br />
              <span className="text-teal-400">Encontrá la mejor salida.</span>
            </h1>
            <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              ¿Querés saber la mejor forma de eliminar tus deudas sin tantas vueltas?
              Por <strong className="text-white/80">$1.000 ARS</strong> accedés a tu solución personalizada — directa y clara.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Banco Nación', 'Galicia', 'Santander', 'BBVA', 'Macro', '+ 9 más'].map(b => (
                <span key={b} className="text-xs font-semibold text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{b}</span>
              ))}
            </div>
            <a href="#calculadora">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl px-6 py-3 text-base">
                Ir a la calculadora <ArrowRight size={16} />
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="relative hidden md:block">
              <div className="absolute -inset-4 bg-teal-500/10 rounded-[40px] blur-2xl" />
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl border-2 border-teal-500/20" />
                <img
                  src="/renzo-hero.png"
                  alt="Renzo Grecco"
                  className="relative w-full max-w-xs mx-auto rounded-3xl object-cover object-top shadow-2xl border border-white/10"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── Calculadora ───────────────────────────────────────────────────────── */}
      <section id="calculadora" className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 mb-8 flex-wrap"
          >
            <button
              onClick={() => setActiveSection('tarjetas')}
              className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all ${
                activeSection === 'tarjetas'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              <CreditCard size={14} /> Deudas de Tarjeta de Crédito
            </button>
            <button
              onClick={() => setActiveSection('prestamos')}
              className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all ${
                activeSection === 'prestamos'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              <Calculator size={14} /> Préstamos Personales e Hipotecarios
            </button>
          </motion.div>

          {/* ── TAB: TARJETAS ── */}
          {activeSection === 'tarjetas' && (
            <motion.div
              key="tarjetas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <div className="h-2 bg-teal-500 w-full" />
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
                        <CreditCard size={11} /> Análisis de deudas — $1.000 ARS
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                        ¿Tenés deudas en la tarjeta?<br />
                        <span className="text-teal-600">Te decimos cómo salir.</span>
                      </h2>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
                        Subí tu resumen de tarjeta — lo analizamos en tu navegador, comparamos tasas de todos los bancos y te damos la estrategia más inteligente para liquidar tu deuda.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-7">
                        {['Visa', 'Mastercard', 'Amex', 'Cabal', 'Naranja X'].map(brand => (
                          <span key={brand} className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                            {brand}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/herramientas/tarjetas">
                          <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl px-6 h-12 text-base">
                            <CreditCard size={16} /> Analizar mis deudas <ArrowRight size={15} />
                          </Button>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Lock size={12} className="shrink-0" />
                          <span>Tus datos nunca salen de tu navegador</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:w-56 shrink-0 space-y-3">
                      {[
                        { icon: '📋', title: 'Subís tu resumen', desc: 'PDF o foto — lo leemos automáticamente' },
                        { icon: '📊', title: 'Comparamos tasas', desc: 'Todos los bancos del mercado argentino' },
                        { icon: '✅', title: 'Recibís tu plan', desc: 'Qué pagar primero, cómo refinanciar' },
                      ].map(step => (
                        <div key={step.title} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <span className="text-lg">{step.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{step.title}</p>
                            <p className="text-xs text-slate-400 leading-snug">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB: PRÉSTAMOS ── */}
          {activeSection === 'prestamos' && (
            <motion.div
              key="prestamos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CalculatorForm
                loanType={loanType}
                setLoanType={setLoanType}
                amount={amount}
                setAmount={setAmount}
                months={months}
                setMonths={setMonths}
                method={method}
                setMethod={setMethod}
                onCompare={handleCalcular}
                compareLabel="Ver Resultados — $1.000 ARS"
                compareLoading={paying}
              />

              {/* Payment info box */}
              <div className="mt-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-start gap-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Pago seguro de $1.000 ARS por Mercado Pago</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Al hacer click en "Ver Resultados" serás redirigido a Mercado Pago para completar el pago.
                    Luego regresás automáticamente con todos los resultados desbloqueados.
                  </p>
                </div>
              </div>

              {payError && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-4 text-sm space-y-3"
                >
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertCircle size={14} className="shrink-0" />
                    Error al conectar con Mercado Pago
                  </div>
                  <p className="text-xs text-rose-600 font-mono bg-rose-100 px-3 py-2 rounded-lg break-all">{payError}</p>
                  <div className="flex items-center gap-2 pt-1 border-t border-rose-200">
                    <p className="text-xs text-slate-500 flex-1">¿Querés ver los resultados de prueba sin pagar?</p>
                    <button
                      className="text-xs font-bold text-teal-600 underline hover:text-teal-800"
                      onClick={() => {
                        window.location.href = '/resultado?status=approved&payment_id=TEST_BYPASS';
                      }}
                    >
                      Ver resultados de prueba →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </div>
      </section>

      {/* ── Sección legal — abogado para deudas ───────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-slate-950 rounded-2xl overflow-hidden px-6 py-7 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#14b8a608_0%,transparent_60%)]" />
            <div className="relative flex-1">
              <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full mb-3">
                <Scale size={11} /> Servicio Legal
              </div>
              <h3 className="text-white font-black text-lg sm:text-xl leading-tight mb-2">
                ¿Necesitás resolver tu situación legal por deudas?
              </h3>
              <p className="text-white/55 text-sm leading-relaxed max-w-xl">
                En caso de necesitar resolver tu situación legal de deudas, no dudes en consultarme también. Como abogado puedo acompañarte en ese proceso por separado.
              </p>
            </div>
            <div className="relative shrink-0">
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola Renzo, me están llamando por deudas y necesito asesoramiento legal.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold gap-2 rounded-xl whitespace-nowrap">
                  <MessageCircle size={14} /> Consultá tu caso
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sobre mí ──────────────────────────────────────────────────────────── */}
      <section id="sobre-mi" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
              <Users size={12} /> Sobre mí
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
              Derecho, finanzas y seguros<br />
              <span className="text-teal-600">en un solo asesor</span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Soy <strong className="text-slate-900">abogado y planificador financiero</strong>. Esa combinación me permite asesorarte con una visión integral que va mucho más allá de los números.
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
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2 relative">
            <div className="absolute -inset-4 bg-teal-50 rounded-[40px]" />
            <div className="relative">
              <img
                src="/renzo-evento.jpeg"
                alt="Renzo Grecco en evento"
                className="relative w-full rounded-3xl object-cover object-top shadow-2xl border-4 border-white"
                style={{ aspectRatio: '4/5' }}
              />
              <div className="absolute -bottom-4 -right-4 bg-teal-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <p className="text-xs font-black">Abogado & Planificador Financiero</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Servicios personales ──────────────────────────────────────────────── */}
      <section id="servicios" className="py-20 px-4 sm:px-6 bg-slate-50">
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

      {/* ── CTA Banner ────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-black text-2xl sm:text-3xl mb-1">Tomá el control de tus finanzas hoy.</p>
            <p className="text-emerald-100 text-sm sm:text-base max-w-lg">
              Analizá tus deudas, comparé opciones y consultá con Renzo. Sin letra chica.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end shrink-0">
            <a href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola Renzo, quiero saber más sobre el análisis de deudas.')}`} target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold gap-2 rounded-xl px-6 shadow-lg">
                <MessageCircle size={15} /> Consultar por WhatsApp
              </Button>
            </a>
            <a href="#contacto">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2 rounded-xl px-6">
                <Send size={14} /> Completar formulario
              </Button>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Contacto ──────────────────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 mb-4">
                  <MessageCircle size={12} /> Contacto
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Contame tu situación</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Cuanto más me contés, mejor puedo ayudarte. Con esta info armo una consulta personalizada antes de hablar con vos.
                </p>
              </div>
              <img src="/renzo-evento.jpeg" alt="Renzo Grecco" className="w-full rounded-2xl object-cover object-top shadow-lg" style={{ aspectRatio: '4/5' }} />
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contacto directo</p>
                {[
                  { icon: <MessageCircle size={13} className="text-emerald-500" />, label: 'WhatsApp', val: 'Escribir mensaje', href: `https://wa.me/${WA}?text=${encodeURIComponent('Hola Renzo, quiero hacer una consulta.')}` },
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
