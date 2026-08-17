import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

const ToolPage = lazy(() => import("@/pages/tool"));
const BlogPage = lazy(() => import("@/pages/blog"));

function ToolLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6" role="status" aria-live="polite">
      <div className="rounded-xl bg-white px-6 py-4 text-slate-600 shadow-lg">
        جاري تحميل الأداة...
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<ToolLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools/:slug" component={ToolPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
