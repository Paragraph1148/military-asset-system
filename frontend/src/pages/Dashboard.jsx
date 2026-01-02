import { useEffect, useState } from "react";
import api from "../services/api";

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          className="text-sm text-red-600"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Closing Balance" value={data.closing_balance} />
        <StatCard label="Net Movement" value={data.net_movement} />
        <StatCard label="Purchases" value={data.purchases} />
        <StatCard label="Transfers In" value={data.transfer_in} />
        <StatCard label="Transfers Out" value={data.transfer_out} />
        <StatCard label="Assigned" value={data.assigned} />
        <StatCard label="Expended" value={data.expended} />
      </div>
    </div>
  );
}

export default Dashboard;
