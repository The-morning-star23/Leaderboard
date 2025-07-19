// Root component: handles user interactions and renders 
import { useEffect, useState } from "react";
import api from "./api";
import BackgroundDecorations from "./components/BackgroundDecorations";
import UserDropdown from "./components/UserDropdown";
import ClaimButton from "./components/ClaimButton";
import LeaderboardList from "./components/LeaderboardList";
import AddUserForm from "./components/AddUserForm";
import ClaimHistory from "./components/ClaimHistory";
import Top3Podium from "./components/Top3Podium";
import EditUserModal from "./components/EditUserModal";
import FloatingGiftIcon from "./components/FloatingGiftIcon";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState("hourly");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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
    <div className="relative min-h-screen bg-yellow-50 overflow-hidden">
      <BackgroundDecorations />
      <FloatingGiftIcon />

      {/* Main content area */}
      <div className="relative z-10 p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-800 drop-shadow">
          🏆 Leaderboard
        </h1>

        {/* User actions */}
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

        {claimedPoints && (
          <div className="text-center text-green-600 font-medium mb-4">
            🎉 Claimed {claimedPoints} points!
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white shadow rounded-full flex overflow-x-auto sm:overflow-visible px-2 whitespace-nowrap max-w-full sm:max-w-none">
            {["Party", "Live", "Hourly", "Family", "Wealth"].map((label) => (
              <button
                key={label}
                onClick={() => setSelectedTab(label.toLowerCase())}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                  selectedTab === label.toLowerCase()
                    ? "text-blue-600 font-bold shadow-md shadow-blue-300/30"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {label}
                {selectedTab === label.toLowerCase() && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-[3px] bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <Top3Podium topThree={leaderboardData.slice(0, 3)} />

        <LeaderboardList
          refresh={refresh}
          selectedUserId={selectedUserId}
          variant={selectedTab}
          setLeaderboardData={setLeaderboardData}
          onEditUser={(user) => setEditingUser(user)}
        />

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSuccess={() => setRefresh((prev) => !prev)}
          />
        )}

        <ClaimHistory refresh={refresh} />
      </div>
    </div>
  );
}

export default App;
