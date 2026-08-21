import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20 px-6 bg-white/50 dark:bg-gray-800/50"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our AI-powered nutrition platform.
        </p>
        {[
          {
            question: "How does Nourish AI analyze my food?",
            answer: "Simply take a photo of your meal, and our advanced AI models identify ingredients, estimate portion sizes, and calculate nutritional content in seconds. Our system uses state-of-the-art computer vision technology trained on millions of food images."
          },
          {
            question: "Is my data secure and private?",
            answer: "Absolutely. We use end-to-end encryption and strict data protection protocols. Your personal health information is never shared without explicit consent and is stored on secure, HIPAA-compliant servers."
          },
          {
            question: "Can I use Nourish AI for specific dietary goals?",
            answer: "Yes! Whether you're aiming for weight loss, muscle gain, managing diabetes, or just eating healthier, our AI adapts recommendations to your unique goals and preferences while respecting dietary restrictions."
          },
          {
            question: "What devices is Nourish AI available on?",
            answer: "Nourish AI is a responsive web app that works on any modern browser. We also offer iOS and Android apps for on-the-go tracking, available in the App Store and Google Play."
          },
          {
            question: "Do you offer a free trial?",
            answer: "Yes, we provide a 7-day free trial of our premium plan so you can experience all features before committing. No credit card is required to start your trial."
          },
          {
            question: "Do I need special hardware to use the AI food recognition?",
            answer: "No special hardware is needed. Simply use your smartphone camera to take photos of meals. For best results, ensure good lighting and capture the entire plate."
          }
        ].map((item) => (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-gray-200 py-4 last:border-b-0"
          >
            <div
              onClick={() => setActiveFaq(activeFaq === item.question ? null : item.question)}
              className="flex items-center justify-between w-full cursor-pointer text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {item.question}
              </h3>
              <motion.span
                rotate={activeFaq === item.question ? 180 : 0}
                className="transition-transform duration-300 h-4 w-4 text-gray-500"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </div>
            {activeFaq === item.question && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 text-sm text-gray-600 leading-relaxed overflow-hidden"
                style={{ height: activeFaq === item.question ? "auto" : 0 }}
              >
                {item.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
