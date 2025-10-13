"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "../../../components/ui/Card";

export default function CompletedRoutes() {
  const { data: session } = useSession();
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const id = (session as any)?.user?.id;
      if (!id) return;
      const res = await fetch(
        `/api/operator/routes/completed?operatorId=${id}`
      );
      const json = await res.json();
      setRoutes(json.data || []);
    })();
  }, [session]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Completed Routes</h1>
      <div className="grid gap-3">
        {routes.map((r) => (
          <Card key={r._id}>
            <div className="text-sm">
              Route {r._id} • Distance: {r.totalDistance?.toFixed?.(2)} • Stops:{" "}
              {r.nodes?.length}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
