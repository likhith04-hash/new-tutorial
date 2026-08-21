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

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const { data: profile } = trpc.profile.get.useQuery();
  const updateProfile = trpc.profile.update.useMutation();

  const [formData, setFormData] = useState({
    unitPreference: "metric",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        unitPreference: profile.unitPreference || "metric",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile.mutateAsync({
        unitPreference: formData.unitPreference as "metric" | "imperial",
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
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
          <button onClick={() => setLocation("/goals")} className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm">
            Goals
          </button>
          <button onClick={() => setLocation("/settings")} className="py-3 px-2 border-b-2 border-green-600 text-green-600 font-medium text-sm">
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-gray-900 font-medium">{user?.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <Label>Account Created</Label>
                <p className="text-gray-900 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="unitPreference">Unit Preference</Label>
                  <Select
                    value={formData.unitPreference}
                    onValueChange={(value) => setFormData({ ...formData, unitPreference: value })}
                  >
                    <SelectTrigger id="unitPreference">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (kg, ml)</SelectItem>
                      <SelectItem value="imperial">Imperial (lbs, oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plan Info */}
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">Free Plan</p>
                <p className="text-sm text-gray-600">Full access to all features</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
