import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Leaf, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Goals() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const { data: goals } = trpc.goals.get.useQuery();
  const { data: profile } = trpc.profile.get.useQuery();
  const updateGoals = trpc.goals.update.useMutation();
  const updateProfile = trpc.profile.update.useMutation();

  const [formData, setFormData] = useState<{
    calorieTarget: string | number;
    proteinTarget: string | number;
    carbsTarget: string | number;
    fatTarget: string | number;
    hydrationTarget: string | number;
    weightGoal: string | number;
    goalType: string;
  }>({
    calorieTarget: 2000,
    proteinTarget: 150,
    carbsTarget: 200,
    fatTarget: 65,
    hydrationTarget: 2000,
    weightGoal: 70,
    goalType: "maintain",
  });

  useEffect(() => {
    if (goals && profile) {
      setFormData({
        calorieTarget: goals.calorieTarget || 2000,
        proteinTarget: parseFloat(goals.proteinTarget as any) || 150,
        carbsTarget: parseFloat(goals.carbsTarget as any) || 200,
        fatTarget: parseFloat(goals.fatTarget as any) || 65,
        hydrationTarget: goals.hydrationTarget || 2000,
        weightGoal: parseFloat(goals.weightGoal as any) || 70,
        goalType: profile.goalType || "maintain",
      });
    }
  }, [goals, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateGoals.mutateAsync({
        calorieTarget: typeof formData.calorieTarget === "string" ? parseInt(formData.calorieTarget) : formData.calorieTarget,
        proteinTarget: typeof formData.proteinTarget === "string" ? parseFloat(formData.proteinTarget) : formData.proteinTarget,
        carbsTarget: typeof formData.carbsTarget === "string" ? parseFloat(formData.carbsTarget) : formData.carbsTarget,
        fatTarget: typeof formData.fatTarget === "string" ? parseFloat(formData.fatTarget) : formData.fatTarget,
        hydrationTarget: typeof formData.hydrationTarget === "string" ? parseInt(formData.hydrationTarget) : formData.hydrationTarget,
        weightGoal: typeof formData.weightGoal === "string" ? parseFloat(formData.weightGoal) : formData.weightGoal,
      });

      if (formData.goalType !== profile?.goalType) {
        await updateProfile.mutateAsync({
          goalType: formData.goalType as "lose" | "maintain" | "gain",
        });
      }

      toast.success("Goals updated successfully");
    } catch (error) {
      toast.error("Failed to update goals");
    } finally {
      setLoading(false);
    }
  };

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
          <button onClick={() => setLocation("/progress")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Progress
          </button>
          <button onClick={() => setLocation("/ai-coach")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            AI Coach
          </button>
          <button onClick={() => setLocation("/goals")} className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            Goals
          </button>
          <button onClick={() => setLocation("/settings")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Goals</CardTitle>
            <CardDescription>Set your daily nutrition targets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Goal Type */}
              <div>
                <Label htmlFor="goalType">Goal Type</Label>
                <Select
                  value={formData.goalType}
                  onValueChange={(value) => setFormData({ ...formData, goalType: value })}
                >
                  <SelectTrigger id="goalType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calorie Target */}
              <div>
                <Label htmlFor="calorieTarget">Daily Calorie Target (kcal)</Label>
                <Input
                  id="calorieTarget"
                  type="number"
                  value={formData.calorieTarget}
                  onChange={(e) => setFormData({ ...formData, calorieTarget: e.target.value })}
                />
              </div>

              {/* Macro Targets */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="proteinTarget">Protein Target (g)</Label>
                  <Input
                    id="proteinTarget"
                    type="number"
                    step="0.1"
                    value={formData.proteinTarget as string | number}
                    onChange={(e) => setFormData({ ...formData, proteinTarget: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbsTarget">Carbs Target (g)</Label>
                  <Input
                    id="carbsTarget"
                    type="number"
                    step="0.1"
                    value={formData.carbsTarget as string | number}
                    onChange={(e) => setFormData({ ...formData, carbsTarget: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fatTarget">Fat Target (g)</Label>
                  <Input
                    id="fatTarget"
                    type="number"
                    step="0.1"
                    value={formData.fatTarget as string | number}
                    onChange={(e) => setFormData({ ...formData, fatTarget: e.target.value })}
                  />
                </div>
              </div>

              {/* Hydration Target */}
              <div>
                <Label htmlFor="hydrationTarget">Daily Hydration Target (ml)</Label>
                <Input
                  id="hydrationTarget"
                  type="number"
                  value={formData.hydrationTarget}
                  onChange={(e) => setFormData({ ...formData, hydrationTarget: e.target.value })}
                />
              </div>

              {/* Weight Goal */}
              <div>
                <Label htmlFor="weightGoal">Weight Goal (kg)</Label>
                <Input
                  id="weightGoal"
                  type="number"
                  step="0.1"
                  value={formData.weightGoal as string | number}
                  onChange={(e) => setFormData({ ...formData, weightGoal: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Goals"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
