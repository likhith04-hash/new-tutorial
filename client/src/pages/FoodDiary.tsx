import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Leaf } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FoodLoggingModal from "@/components/FoodLoggingModal";

export default function FoodDiary() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFoodLogging, setShowFoodLogging] = useState(false);

  const { data: logs, isLoading } = trpc.foodLogs.forDate.useQuery(selectedDate);
  const deleteFoodLog = trpc.foodLogs.delete.useMutation();

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDeleteLog = async (logId: number) => {
    try {
      await deleteFoodLog.mutateAsync(logId);
      trpc.useUtils().foodLogs.forDate.invalidate(selectedDate);
      toast.success("Meal deleted");
    } catch (error) {
      toast.error("Failed to delete meal");
    }
  };

  const groupedLogs = {
    breakfast: logs?.filter((log) => log.mealType === "breakfast") || [],
    lunch: logs?.filter((log) => log.mealType === "lunch") || [],
    dinner: logs?.filter((log) => log.mealType === "dinner") || [],
    snack: logs?.filter((log) => log.mealType === "snack") || [],
  };

  const totalCalories = logs?.reduce((sum, log) => sum + log.calories, 0) || 0;
  const totalProtein = logs?.reduce((sum, log) => sum + parseFloat(log.protein as any), 0) || 0;
  const totalCarbs = logs?.reduce((sum, log) => sum + parseFloat(log.carbs as any), 0) || 0;
  const totalFat = logs?.reduce((sum, log) => sum + parseFloat(log.fat as any), 0) || 0;

  const mealTypes = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "lunch", label: "Lunch", icon: "🍽️" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
    { key: "snack", label: "Snacks", icon: "🍎" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nourish</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button onClick={() => setLocation("/dashboard")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm">
            Dashboard
          </button>
          <button onClick={() => setLocation("/food-diary")} className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            Food Diary
          </button>
          <button onClick={() => setLocation("/progress")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm">
            Progress
          </button>
          <button onClick={() => setLocation("/ai-coach")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm">
            AI Coach
          </button>
          <button onClick={() => setLocation("/goals")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm">
            Goals
          </button>
          <button onClick={() => setLocation("/settings")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium text-sm">
            Settings
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Food Diary</CardTitle>
                <CardDescription>Track your meals by date</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handlePrevDay}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-center min-w-[200px]">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleNextDay}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-8 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Daily Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCalories} <span className="text-sm text-gray-600 dark:text-gray-400">kcal</span></p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                <p className="text-2xl font-bold text-red-600">{Math.round(totalProtein)} <span className="text-sm text-gray-600 dark:text-gray-400">g</span></p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(totalCarbs)} <span className="text-sm text-gray-600 dark:text-gray-400">g</span></p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                <p className="text-2xl font-bold text-amber-600">{Math.round(totalFat)} <span className="text-sm text-gray-600 dark:text-gray-400">g</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {mealTypes.map(({ key, label, icon }) => {
          const mealLogs = groupedLogs[key as keyof typeof groupedLogs];
          const mealCalories = mealLogs.reduce((sum, log) => sum + log.calories, 0);

          return (
            <Card key={key} className="mb-6 dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <CardTitle>{label}</CardTitle>
                      <CardDescription>{mealCalories} kcal</CardDescription>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowFoodLogging(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {mealLogs.length > 0 ? (
                  <div className="space-y-3">
                    {mealLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{(log as any).foodName || "Manual entry"}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {log.calories} kcal • {Math.round(parseFloat(log.protein as any))}g protein • {Math.round(parseFloat(log.carbs as any))}g carbs • {Math.round(parseFloat(log.fat as any))}g fat
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
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">No meals logged for {label.toLowerCase()}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>

      <FoodLoggingModal
        isOpen={showFoodLogging}
        onClose={() => setShowFoodLogging(false)}
        onSuccess={() => {
          trpc.useUtils().foodLogs.forDate.invalidate(selectedDate);
        }}
      />
    </div>
  );
}
