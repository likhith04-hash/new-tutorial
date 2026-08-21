import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import FoodDiary from "./pages/FoodDiary";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import AICoach from "./pages/AICoach";
import Login from "./pages/Login";

function Router() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Check if user has completed onboarding
  const needsOnboarding = !user?.lastSignedIn || user?.createdAt === user?.lastSignedIn;

  if (needsOnboarding) {
    return (
      <Switch>
        <Route path={"/onboarding"} component={Onboarding} />
        <Route component={Onboarding} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/food-diary"} component={FoodDiary} />
      <Route path={"/goals"} component={Goals} />
      <Route path={"/progress"} component={Progress} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/ai-coach"} component={AICoach} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
