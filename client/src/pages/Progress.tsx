import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Leaf, Trophy } from "lucide-react";

export default function Progress() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: weightHistory } = trpc.weights.history.useQuery(90);
  const { data: recentLogs } = trpc.foodLogs.recent.useQuery(30);

  // Process weight data for chart
  const weightData = weightHistory?.map((entry) => ({
    date: new Date(entry.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: parseFloat(entry.weight as any),
  })) || [];

  // Process macro trends
  const macroTrends = generateMacroTrends(recentLogs || []);

  // Calculate streaks and badges
  const { loggingStreak, hydrationDays, proteinDays } = calculateStats(recentLogs || []);

  const badges = [
    { id: 1, name: "Logging Streak", description: `${loggingStreak} days`, earned: loggingStreak >= 7, icon: "📝" },
    { id: 2, name: "Hydration Hero", description: "7-day hydration goal", earned: hydrationDays >= 7, icon: "💧" },
    { id: 3, name: "Protein Power", description: "7-day protein goal", earned: proteinDays >= 7, icon: "💪" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Nourish</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button onClick={() => setLocation("/dashboard")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Dashboard
          </button>
          <button onClick={() => setLocation("/food-diary")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Food Diary
          </button>
          <button onClick={() => setLocation("/progress")} className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            Progress
          </button>
          <button onClick={() => setLocation("/ai-coach")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            AI Coach
          </button>
          <button onClick={() => setLocation("/goals")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Goals
          </button>
          <button onClick={() => setLocation("/settings")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h2>

        {/* Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {badges.map((badge) => (
            <Card key={badge.id} className={badge.earned ? "border-green-200 bg-green-50" : "border-gray-200 opacity-50"}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  {badge.earned && <p className="text-xs text-green-600 mt-2">✓ Earned</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weight Trend */}
        {weightData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
              <CardDescription>Last 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Macro Trends */}
        {macroTrends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Macro Trends</CardTitle>
              <CardDescription>Last 30 days average</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={macroTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" fill="#ef4444" name="Protein (g)" />
                  <Bar dataKey="carbs" fill="#3b82f6" name="Carbs (g)" />
                  <Bar dataKey="fat" fill="#f59e0b" name="Fat (g)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function generateMacroTrends(logs: any[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayLogs = logs.filter((log) => {
      const logDate = new Date(log.loggedAt).toISOString().split("T")[0];
      return logDate === dateStr;
    });

    const totalProtein = dayLogs.reduce((sum, log) => sum + parseFloat(log.protein as any), 0);
    const totalCarbs = dayLogs.reduce((sum, log) => sum + parseFloat(log.carbs as any), 0);
    const totalFat = dayLogs.reduce((sum, log) => sum + parseFloat(log.fat as any), 0);

    data.push({
      day: days[(date.getDay() + 6) % 7],
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
    });
  }

  return data;
}

function calculateStats(logs: any[]) {
  let loggingStreak = 0;
  let hydrationDays = 0;
  let proteinDays = 0;

  // Simple streak calculation
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayLogs = logs.filter((log) => {
      const logDate = new Date(log.loggedAt).toISOString().split("T")[0];
      return logDate === dateStr;
    });

    if (dayLogs.length > 0) {
      loggingStreak++;
    } else if (loggingStreak > 0) {
      break;
    }
  }

  return { loggingStreak, hydrationDays: 0, proteinDays: 0 };
}
