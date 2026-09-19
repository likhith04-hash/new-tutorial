import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, Search, Clock } from "lucide-react";

interface FoodLoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FoodLoggingModal({ isOpen, onClose, onSuccess }: FoodLoggingModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [quantity, setQuantity] = useState("1");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const { data: searchResults } = trpc.foods.search.useQuery(
    { query: searchQuery, limit: 10 },
    { enabled: searchQuery.length > 0 && !manualMode }
  );
  const { data: recentLogs } = trpc.foodLogs.recent.useQuery(7);

  const logFood = trpc.foodLogs.log.useMutation();

  // Get unique recent foods for quick repeat
  const recentFoods = useMemo(() => {
    if (!recentLogs) return [];
    const seen = new Set();
    return recentLogs
      .filter((log: any) => {
        if (seen.has(log.foodId)) return false;
        seen.add(log.foodId);
        return true;
      })
      .slice(0, 5);
  }, [recentLogs]);

  const handleLogFood = async () => {
    if (!selectedFood && !manualMode) {
      toast.error("Please select a food");
      return;
    }

    if (manualMode && (!manualData.name || !manualData.calories)) {
      toast.error("Please fill in food name and calories");
      return;
    }

    try {
      if (manualMode) {
        await logFood.mutateAsync({
          foodId: 0,
          mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
          quantity: parseFloat(quantity) || 1,
          calories: parseInt(manualData.calories),
          protein: parseFloat(manualData.protein) || 0,
          carbs: parseFloat(manualData.carbs) || 0,
          fat: parseFloat(manualData.fat) || 0,
        });
      } else {
        const quantityNum = parseFloat(quantity) || 1;
        await logFood.mutateAsync({
          foodId: selectedFood.id,
          mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
          quantity: quantityNum,
          calories: Math.round(selectedFood.calories * quantityNum),
          protein: parseFloat(selectedFood.protein) * quantityNum,
          carbs: parseFloat(selectedFood.carbs) * quantityNum,
          fat: parseFloat(selectedFood.fat) * quantityNum,
        });
      }

      toast.success("Food logged successfully!");
      trpc.useUtils().foodLogs.today.invalidate();
      trpc.useUtils().foodLogs.recent.invalidate();
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to log food");
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setMealType("breakfast");
    setQuantity("1");
    setSelectedFood(null);
    setManualMode(false);
    setManualData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Log Food</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Meal Type */}
          <div>
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="mealType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={manualMode ? "outline" : "default"}
              size="sm"
              onClick={() => setManualMode(false)}
              className="flex-1"
            >
              Search Database
            </Button>
            <Button
              variant={manualMode ? "default" : "outline"}
              size="sm"
              onClick={() => setManualMode(true)}
              className="flex-1"
            >
              Manual Entry
            </Button>
          </div>

          {/* Quick Repeat */}
          {recentFoods.length > 0 && !manualMode && (
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recently Logged
              </Label>
              <div className="space-y-2 mt-2">
                {recentFoods.map((log: any) => (
                  <button
                    key={log.id}
                    onClick={() => {
                      setSelectedFood({
                        id: log.foodId,
                        name: `${log.calories} kcal`,
                        calories: log.calories,
                        protein: log.protein,
                        carbs: log.carbs,
                        fat: log.fat,
                        servingSize: "1 serving",
                      });
                      setQuantity("1");
                    }}
                    className="w-full p-2 text-left rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition"
                  >
                    <p className="font-medium text-gray-900 text-sm">{(log as any).foodName || `${log.calories} kcal`}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Mode */}
          {!manualMode && (
            <>
              <div>
                <Label htmlFor="search">Search Foods</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="e.g., chicken, rice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((food: any) => (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className={`p-3 rounded-lg cursor-pointer border-2 transition ${
                        selectedFood?.id === food.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-600">
                        {food.calories} kcal • {food.servingSize}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              {selectedFood && (
                <div>
                  <Label htmlFor="quantity">Quantity (servings)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {Math.round(selectedFood.calories * (parseFloat(quantity) || 1))} kcal
                  </p>
                </div>
              )}
            </>
          )}

          {/* Manual Entry Mode */}
          {manualMode && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g., Grilled Chicken"
                  value={manualData.name}
                  onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={manualData.calories}
                  onChange={(e) => setManualData({ ...manualData, calories: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualData.protein}
                    onChange={(e) => setManualData({ ...manualData, protein: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualData.carbs}
                    onChange={(e) => setManualData({ ...manualData, carbs: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualData.fat}
                    onChange={(e) => setManualData({ ...manualData, fat: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleLogFood}
            disabled={logFood.isPending || (!selectedFood && !manualMode)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {logFood.isPending ? "Logging..." : "Log Food"}
          </Button>
        </div>
      </div>
    </div>
  );
}
