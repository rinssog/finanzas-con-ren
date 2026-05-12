import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy-loaded pages — reduce el bundle inicial de 2MB a ~400KB
const Home       = lazy(() => import("@/pages/Home"));
const Comparador = lazy(() => import("@/pages/Comparador"));
const Tarjetas   = lazy(() => import("@/pages/Tarjetas"));
const Resultado  = lazy(() => import("@/pages/Resultado"));
const Admin      = lazy(() => import("@/pages/Admin"));
const NotFound   = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
        <p className="text-white/40 text-sm font-medium">Cargando…</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/"                     component={Home} />
        <Route path="/herramientas"          component={Comparador} />
        <Route path="/herramientas/tarjetas" component={Tarjetas} />
        <Route path="/resultado"             component={Resultado} />
        <Route path="/admin"                 component={Admin} />
        <Route                               component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
