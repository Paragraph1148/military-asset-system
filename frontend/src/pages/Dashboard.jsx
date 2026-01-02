import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div>loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>Closing Balance: {data.closing_balance}</p>
      <p>Net Movement: {data.net_movement}</p>
      <p>Purchases: {data.purchases}</p>
      <p>Transfers In: {data.transfer_in}</p>
      <p>Transfers Out: {data.transfer_out}</p>
      <p>Assigned: {data.assigned}</p>
      <p>Expended: {data.expended}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
