"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FileText,
  AlertCircle,
  Send,
  CheckCircle,
  MessageSquare,
  Calendar,
  Info,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

const reportTypes = [
  { value: "issue", label: "Route Issue", icon: AlertCircle, color: "red" },
  { value: "feedback", label: "Feedback", icon: MessageSquare, color: "blue" },
  { value: "suggestion", label: "Suggestion", icon: Info, color: "emerald" },
];

export default function ReportsPage() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [type, setType] = useState("issue");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const operatorId = (session as any)?.user?.id;
      const res = await fetch("/api/operator/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorId, message: text, type }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      toast.success("Report submitted successfully");
      setText("");
      setType("issue");
    } catch (e: any) {
      toast.error(e?.message || "Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reports & Feedback
          </h1>
          <p className="text-gray-600 mt-1">
            Submit issues, feedback, or suggestions to help us improve
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span suppressHydrationWarning>
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Select Report Type
            </h2>
            <p className="text-gray-600 text-sm">
              Choose the category that best describes your submission
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((rt) => {
            const isSelected = type === rt.value;
            const Icon = rt.icon;
            return (
              <button
                key={rt.value}
                onClick={() => setType(rt.value)}
                className={`
                  p-6 rounded-xl border-2 transition-all duration-200 text-left
                  ${
                    isSelected
                      ? `border-${rt.color}-500 bg-${rt.color}-50 shadow-md`
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${
                      isSelected
                        ? `bg-${rt.color}-100`
                        : "bg-gray-100"
                    }
                  `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? `text-${rt.color}-600` : "text-gray-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold ${
                      isSelected ? `text-${rt.color}-900` : "text-gray-900"
                    }`}
                  >
                    {rt.label}
                  </h3>
                </div>
                {isSelected && (
                  <CheckCircle className={`w-5 h-5 text-${rt.color}-600 ml-auto`} />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Report Form */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Your Message
            </h2>
            <p className="text-gray-600 text-sm">
              Provide detailed information about your report
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Details
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-900 placeholder-gray-400"
              placeholder="Describe the issue, provide feedback, or share your suggestion in detail..."
            />
            <p className="text-sm text-gray-500 mt-2">
              {text.length} / 1000 characters
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={onSubmit}
              loading={isSubmitting}
              disabled={!text.trim() || isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </Button>
            <Button
              onClick={() => {
                setText("");
                setType("issue");
              }}
              variant="outline"
              disabled={isSubmitting}
              size="lg"
            >
              Clear Form
            </Button>
          </div>
        </div>
      </Card>

      {/* Help Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Quick Tips for Effective Reports
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about the issue or suggestion</li>
              <li>• Include route IDs or locations when relevant</li>
              <li>• Describe what happened and what you expected</li>
              <li>• Your reports help us improve the system for everyone</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
