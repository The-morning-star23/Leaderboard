// Root component: handles user interactions and renders leaderboard and claim features
import { useEffect, useState } from "react";
import api from "./api";
import UserDropdown from "./components/UserDropdown";
import ClaimButton from "./components/ClaimButton";
import LeaderboardList from "./components/LeaderboardList";
import AddUserForm from "./components/AddUserForm";
import ClaimHistory from "./components/ClaimHistory";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [refresh, setRefresh] = useState(false); // used to trigger re-fetch

  // Fetch users on mount or refresh
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🏆 Leaderboard</h1>
      
      {/* User selection, claiming points, and adding new user */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <UserDropdown
          users={users}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
        />
        <ClaimButton
          selectedUserId={selectedUserId}
          setClaimedPoints={setClaimedPoints}
          onSuccess={() => setRefresh(!refresh)}
        />
        <AddUserForm onSuccess={() => setRefresh(!refresh)} />
      </div>

      {/* Show last claimed points */}
      {claimedPoints && (
        <div className="text-center text-green-600 font-medium mb-4">
          🎉 Claimed {claimedPoints} points!
        </div>
      )}

      {/* Leaderboard and claim history */}
      <LeaderboardList refresh={refresh} selectedUserId={selectedUserId} />
      <ClaimHistory refresh={refresh} />
    </div>
  );
}

export default App;
