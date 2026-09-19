import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Apple, User, Activity, Target } from "lucide-react";

const STEPS = [
  { id: 1, label: "About You", icon: User },
  { id: 2, label: "Body Stats", icon: Activity },
  { id: 3, label: "Goals", icon: Target },
  { id: 4, label: "Your Plan", icon: Check },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "lightly_active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
];

const GOAL_TYPES = [
  { value: "lose", label: "Lose Weight", desc: "Calorie deficit for fat loss" },
  { value: "maintain", label: "Maintain Weight", desc: "Stay at current weight" },
  { value: "gain", label: "Gain Weight", desc: "Calorie surplus for muscle gain" },
];

function calculateTargets(
  weight: number,
  height: number,
  age: number,
  activityLevel: string,
  goalType: string,
  gender: string = "male"
) {
  // Mifflin-St Jeor equation
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const tdee = bmr * (multipliers[activityLevel] || 1.55);

  // Goal adjustment
  let calories = tdee;
  if (goalType === "lose") calories = tdee - 500;
  if (goalType === "gain") calories = tdee + 300;

  // Macro split (protein-heavy for body comp)
  const protein = Math.round(weight * 2); // 2g per kg
  const fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4); // remainder from carbs
  const hydration = Math.round(weight * 35); // 35ml per kg

  return {
    calories: Math.round(calories),
    protein,
    carbs: Math.max(carbs, 50),
    fat,
    hydration,
  };
}

export default function Onboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateProfile = trpc.profile.update.useMutation();
  const updateGoals = trpc.goals.update.useMutation();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "moderately_active",
    goalType: "maintain",
  });

  const [targets, setTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    hydration: 2000,
  });

  const [showOverride, setShowOverride] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 0;
      case 2: return formData.age && formData.weight && formData.height;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 3) {
      // Calculate targets when moving to review step
      const w = parseFloat(formData.weight);
      const h = parseFloat(formData.height);
      const a = parseInt(formData.age);
      if (w && h && a) {
        const calculated = calculateTargets(w, h, a, formData.activityLevel, formData.goalType);
        setTargets(calculated);
      }
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile.mutateAsync({
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        goalType: formData.goalType as "lose" | "maintain" | "gain",
      });

      await updateGoals.mutateAsync({
        calorieTarget: targets.calories,
        proteinTarget: targets.protein,
        carbsTarget: targets.carbs,
        fatTarget: targets.fat,
        hydrationTarget: targets.hydration,
      });

      // Mark onboarding complete by updating lastSignedIn to now
      // (the App.tsx check is: createdAt === lastSignedIn means needs onboarding)
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Failed to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl p-4 shadow-lg shadow-green-200">
              <Apple className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Nourish</h1>
          <p className="text-gray-500 mt-1">Let's set up your nutrition plan</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  step > s.id
                    ? "bg-green-500 text-white"
                    : step === s.id
                    ? "bg-green-500 text-white ring-4 ring-green-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-1 transition-all ${
                    step > s.id ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = STEPS[step - 1].icon;
                    return <Icon className="h-5 w-5 text-green-600" />;
                  })()}
                  {STEPS[step - 1].label}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us a bit about yourself"}
                  {step === 2 && "Help us calculate your daily targets"}
                  {step === 3 && "What's your primary goal?"}
                  {step === 4 && "Review your personalized nutrition plan"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Step 1: Name */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Alex"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Body Stats */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        min={14}
                        max={100}
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          placeholder="70"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          placeholder="175"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Activity + Goal */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Activity Level</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {ACTIVITY_LEVELS.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.activityLevel === level.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <p className="font-medium text-sm text-gray-900">{level.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{level.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Your Goal</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {GOAL_TYPES.map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, goalType: goal.value })}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              formData.goalType === goal.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <p className="font-medium text-sm text-gray-900">{goal.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{goal.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Targets */}
                {step === 4 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Based on your stats, here's your personalized daily plan:
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-700">{targets.calories}</p>
                        <p className="text-xs text-green-600">kcal / day</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-700">{targets.protein}g</p>
                        <p className="text-xs text-blue-600">protein</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-amber-700">{targets.carbs}g</p>
                        <p className="text-xs text-amber-600">carbs</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-700">{targets.fat}g</p>
                        <p className="text-xs text-purple-600">fat</p>
                      </div>
                    </div>

                    <div className="bg-sky-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-sky-700">
                        {targets.hydration} ml water / day
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowOverride(!showOverride)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      {showOverride ? "Hide" : "Customize"} targets
                    </button>

                    {showOverride && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 pt-2"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="cal" className="text-xs">Calories</Label>
                            <Input
                              id="cal"
                              type="number"
                              value={targets.calories}
                              onChange={(e) => setTargets({ ...targets, calories: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="pro" className="text-xs">Protein (g)</Label>
                            <Input
                              id="pro"
                              type="number"
                              value={targets.protein}
                              onChange={(e) => setTargets({ ...targets, protein: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="carb" className="text-xs">Carbs (g)</Label>
                            <Input
                              id="carb"
                              type="number"
                              value={targets.carbs}
                              onChange={(e) => setTargets({ ...targets, carbs: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fatI" className="text-xs">Fat (g)</Label>
                            <Input
                              id="fatI"
                              type="number"
                              value={targets.fat}
                              onChange={(e) => setTargets({ ...targets, fat: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? "Saving..." : "Start Tracking"}
              {!loading && <Check className="h-4 w-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
