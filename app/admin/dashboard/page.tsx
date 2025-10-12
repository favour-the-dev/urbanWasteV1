import MapView from "../../../components/maps/MapView";
import Card from "../../../components/ui/Card";

export default function AdminDashboard() {
  const dummyNodes: [number, number][] = [
    [4.7842, 7.0337],
    [4.7865, 7.034],
    [4.788, 7.037],
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg">Map</h2>
          <MapView nodes={dummyNodes} path={dummyNodes} />
        </Card>
        <Card>
          <h2 className="text-lg">Analytics</h2>
          <p>Total routes: 0</p>
        </Card>
      </div>
    </div>
  );
}
