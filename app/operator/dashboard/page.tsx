import MapView from "../../../components/maps/MapView";
import Card from "../../../components/ui/Card";

export default function OperatorDashboard() {
  const dummyNodes: [number, number][] = [
    [4.7842, 7.0337],
    [4.7865, 7.034],
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Operator Dashboard</h1>
      <Card>
        <h2 className="text-lg">Assigned Route</h2>
        <MapView nodes={dummyNodes} path={dummyNodes} />
      </Card>
    </div>
  );
}
