import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startLogin } from "@/const";
import { Apple, Leaf } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Nourish</h1>
          </div>
          <p className="text-gray-600">AI-powered nutrition & fitness tracking</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Sign in to track your nutrition and fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => startLogin()}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Sign In
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              Secure sign-in powered by Manus
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900">Log Food</div>
            <p className="text-gray-600">Track meals instantly</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900">AI Coach</div>
            <p className="text-gray-600">Get personalized advice</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900">Track Progress</div>
            <p className="text-gray-600">Monitor your goals</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-900">Insights</div>
            <p className="text-gray-600">Real-time analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
