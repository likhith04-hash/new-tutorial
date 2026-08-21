import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Apple, Banana, Carrot } from "lucide-react";

export default function Onboarding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-full p-6">
              <Apple className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900">Nourish AI</h1>
          <p className="text-gray-600 max-w-sm mx-auto">
            Transform your relationship with food through intelligent nutrition analysis and personalized meal planning.
          </p>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">AI-powered food recognition</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Personalized meal planning</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Progress tracking</span>
          </div>
        </motion.div>

        {/* Food Illustrations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative py-6"
        >
          <div className="flex justify-center items-center space-x-6">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, delay: 0.5 }}
              className="bg-white rounded-2xl p-4 shadow-lg"
            >
              <Apple className="h-12 w-12 text-green-500" />
            </motion.div>

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -15 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, delay: 0.8 }}
              className="bg-white rounded-2xl p-4 shadow-lg"
            >
              <Banana className="h-12 w-12 text-yellow-500" />
            </motion.div>

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -5 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.2, delay: 0.6 }}
              className="bg-white rounded-2xl p-4 shadow-lg"
            >
              <Carrot className="h-12 w-12 text-orange-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-6"
        >
          <Button
            variant="default"
            className="w-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started with Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-sm text-gray-500">
            No credit card required • 7-day free trial
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
