import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, Plus, Trash2, Edit2, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import FoodLoggingModal from "@/components/FoodLoggingModal";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showFoodLogging, setShowFoodLogging] = useState(false);

  // Fetch data
  const { data: goals, isLoading: goalsLoading } = trpc.goals.get.useQuery();
  const { data: todayLogs, isLoading: logsLoading } = trpc.foodLogs.today.useQuery();
  const { data: recentLogs, isLoading: recentLoading } = trpc.foodLogs.recent.useQuery(7);
  const { data: profile } = trpc.profile.get.useQuery();
  const { data: todayHydration = 0 } = trpc.hydration.today.useQuery();
  const logHydration = trpc.hydration.log.useMutation();

  const handleAddGlass = async () => {
    try {
      await logHydration.mutateAsync(250); // 250ml per glass
      trpc.useUtils().hydration.today.invalidate();
    } catch (error) {
      console.error("Failed to log hydration");
    }
  };

  // Calculate totals
  const totalCalories = todayLogs?.reduce((sum, log) => sum + log.calories, 0) || 0;
  const totalProtein = todayLogs?.reduce((sum: number, log: any) => sum + (typeof log.protein === "string" ? parseFloat(log.protein) : log.protein), 0) || 0;
  const totalCarbs = todayLogs?.reduce((sum: number, log: any) => sum + (typeof log.carbs === "string" ? parseFloat(log.carbs) : log.carbs), 0) || 0;
  const totalFat = todayLogs?.reduce((sum: number, log: any) => sum + (typeof log.fat === "string" ? parseFloat(log.fat) : log.fat), 0) || 0;

  const calorieTarget = goals?.calorieTarget || 2000;
  const proteinTarget = typeof goals?.proteinTarget === "string" ? parseFloat(goals.proteinTarget) : goals?.proteinTarget || 150;
  const carbsTarget = typeof goals?.carbsTarget === "string" ? parseFloat(goals.carbsTarget) : goals?.carbsTarget || 200;
  const fatTarget = typeof goals?.fatTarget === "string" ? parseFloat(goals.fatTarget) : goals?.fatTarget || 65;

  const calorieRemaining = calorieTarget - totalCalories;
  const caloriePercent = Math.min(100, (totalCalories / calorieTarget) * 100);

  // Weekly data for charts
  const weeklyData = recentLogs ? generateWeeklyData(recentLogs, calorieTarget) : [];

  // Macro breakdown for pie chart
  const macroData = [
    { name: "Protein", value: totalProtein, color: "#ef4444" },
    { name: "Carbs", value: totalCarbs, color: "#3b82f6" },
    { name: "Fat", value: totalFat, color: "#f59e0b" },
  ];

  const deleteFoodLog = trpc.foodLogs.delete.useMutation();
  const handleDeleteLog = async (logId: number) => {
    try {
      await deleteFoodLog.mutateAsync(logId);
      // Invalidate queries to refresh
      trpc.useUtils().foodLogs.today.invalidate();
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  if (goalsLoading || logsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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
          <button onClick={() => setLocation("/dashboard")} className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            Dashboard
          </button>
          <button onClick={() => setLocation("/food-diary")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Food Diary
          </button>
          <button onClick={() => setLocation("/progress")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
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
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name}
          </h2>
          <p className="text-gray-600">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Calorie Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Daily Calorie Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consumed</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCalories} <span className="text-lg text-gray-600">kcal</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-3xl font-bold ${calorieRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(calorieRemaining)} <span className="text-lg text-gray-600">kcal</span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-full transition-all"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Target: {calorieTarget} kcal</p>
            </CardContent>
          </Card>

          {/* Hydration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hydration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{todayHydration || 0}</p>
                <p className="text-sm text-gray-600">/ {goals?.hydrationTarget || 2000} ml</p>
              </div>
              <Button
                onClick={handleAddGlass}
                disabled={logHydration.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {logHydration.isPending ? "Adding..." : "Add Glass"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Macro Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Macro Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Protein */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Protein</span>
                  <span className="text-sm font-bold text-red-600">{Math.round(totalProtein)}g / {proteinTarget}g</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full"
                    style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Carbs</span>
                  <span className="text-sm font-bold text-blue-600">{Math.round(totalCarbs)}g / {carbsTarget}g</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${Math.min(100, (totalCarbs / carbsTarget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Fat</span>
                  <span className="text-sm font-bold text-amber-600">{Math.round(totalFat)}g / {fatTarget}g</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full"
                    style={{ width: `${Math.min(100, (totalFat / fatTarget) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Today's Meals */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Meals</CardTitle>
            <Button onClick={() => setShowFoodLogging(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Food
            </Button>
          </CardHeader>
          <CardContent>
            {todayLogs && todayLogs.length > 0 ? (
              <div className="space-y-3">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Food Item</p>
                      <p className="text-sm text-gray-600">
                        {log.calories} kcal • {Math.round(parseFloat(log.protein as any))}g protein
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLog(log.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No meals logged yet. Start by logging your first meal!</p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        {weeklyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Calorie Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="#10b981" name="Calories" />
                  <Bar dataKey="target" fill="#d1d5db" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Food Logging Modal */}
        <FoodLoggingModal
          isOpen={showFoodLogging}
          onClose={() => setShowFoodLogging(false)}
          onSuccess={() => {
            trpc.useUtils().foodLogs.today.invalidate();
            trpc.useUtils().foodLogs.recent.invalidate();
          }}
        />
      </main>
    </div>
  );
}

function generateWeeklyData(logs: any[], calorieTarget: number) {
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

    const totalCalories = dayLogs.reduce((sum, log) => sum + log.calories, 0);

    data.push({
      day: days[(date.getDay() + 6) % 7],
      calories: totalCalories,
      target: calorieTarget,
    });
  }

  return data;
}
