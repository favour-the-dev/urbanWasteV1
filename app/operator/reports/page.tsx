"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [text, setText] = useState("");

  const onSubmit = async () => {
    try {
      const operatorId = (session as any)?.user?.id;
      const res = await fetch("/api/operator/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorId, message: text }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      toast.success("Report submitted");
      setText("");
    } catch (e: any) {
      toast.error(e?.message || "Submit failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <Card>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-3 rounded bg-white/5"
          placeholder="Describe issue or feedback"
        />
        <div className="mt-2">
          <Button onClick={onSubmit}>Submit Report</Button>
        </div>
      </Card>
    </div>
  );
}
