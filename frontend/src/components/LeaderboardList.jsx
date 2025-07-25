import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import getInitials from "../utils/getInitials";

const MotionDiv = motion.div;

function LeaderboardList({ refresh, selectedUserId, variant, setLeaderboardData, onEditUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topN, setTopN] = useState("all");
  const [timeFilter, setTimeFilter] = useState("daily");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/users/leaderboard?period=${timeFilter}`);
        setLeaderboard(res.data);
        setLeaderboardData(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [refresh, setLeaderboardData, timeFilter]);

  const handleEdit = (user) => {
    onEditUser(user);
  };

  const filteredLeaderboard = leaderboard
    .filter((user, idx) => {
      const isBelowTop3 = leaderboard.length > 3 ? idx >= 3 : true;
      const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return isBelowTop3 && matchesSearch;
    })
    .slice(0, topN === "all" ? leaderboard.length : Number(topN));

  return (
    <MotionDiv
      layout
      className={`p-4 rounded-2xl shadow-xl max-w-2xl mx-auto transition-all duration-300 ${
        variant === "hourly"
          ? "bg-yellow-50 text-black"
          : variant === "live"
          ? "bg-yellow-50 text-black"
          : variant === "wealth"
          ? "bg-yellow-50 text-black"
          : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-bold mb-4 text-center text-yellow-800 drop-shadow">
        {variant.charAt(0).toUpperCase() + variant.slice(1)} Ranking
      </h2>

      {/* Time Filter */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setTimeFilter("daily")}
          className={`px-3 py-1 rounded-full font-semibold transition ${
            timeFilter === "daily" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setTimeFilter("monthly")}
          className={`px-3 py-1 rounded-full font-semibold transition ${
            timeFilter === "monthly" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={topN}
          onChange={(e) => setTopN(e.target.value)}
          className="p-2 border rounded w-full sm:w-40 shadow-sm bg-white text-black"
        >
          <option value="all">Show All</option>
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[400px] table-auto text-left border-t border-gray-200">
          <thead className="bg-white text-black">
            <tr className="text-gray-600 border-b">
              <th className="py-2">Rank</th>
              <th className="py-2">Name</th>
              <th className="py-2 text-right">Points</th>
              <th className="py-2 text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((user) => (
              <tr
                key={user._id}
                className={`border-b transition-all duration-300 ${
                  user._id === selectedUserId
                    ? "bg-yellow-200 text-black font-semibold"
                    : ""
                }`}
              >
                <td className="py-2 w-12 text-center">{user.rank ?? "-"}</td>
                <td className="py-2 flex items-center gap-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {getInitials(user.name || "")}
                    </div>
                  )}
                  <span className="ml-2">{user.name || "Unknown"}</span>
                </td>
                <td className="py-2 text-right">{user.totalPoints ?? 0}</td>
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionDiv>
  );
}

LeaderboardList.propTypes = {
  refresh: PropTypes.bool.isRequired,
  selectedUserId: PropTypes.string.isRequired,
  setLeaderboardData: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["hourly", "live", "wealth"]).isRequired,
  onEditUser: PropTypes.func.isRequired,
};

export default LeaderboardList;
