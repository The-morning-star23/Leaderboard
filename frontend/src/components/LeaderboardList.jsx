import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import getInitials from "../utils/getInitials";

const MotionDiv = motion.div;

const medalIcons = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

// Renders the dynamic leaderboard with search and top N filtering
function LeaderboardList({ refresh, selectedUserId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topN, setTopN] = useState("all");

  // Fetch leaderboard data when `refresh` changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/users/leaderboard");
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [refresh]);

  // Filter and slice logic
  const filteredLeaderboard = leaderboard
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, topN === "all" ? leaderboard.length : Number(topN));

  return (
    <MotionDiv
      layout
      className="bg-white p-4 rounded shadow max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Leaderboard</h2>

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
          className="p-2 border rounded w-full sm:w-40"
        >
          <option value="all">Show All</option>
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] table-auto text-left border-t border-gray-200">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2">Rank</th>
              <th className="py-2">Name</th>
              <th className="py-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b transition-all duration-300 ${
                  user._id === selectedUserId ? "bg-yellow-100 font-semibold" : ""
                }`}
              >
                <td className="py-2 w-12 text-center">
                  {medalIcons[index + 1] || index + 1}
                </td>
                <td className="py-2 flex items-center gap-2">
                  {/* Avatar using initials */}
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {getInitials(user.name)}
                  </div>
                  {user.name}
                </td>
                <td className="py-2 text-right">{user.totalPoints}</td>
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
};

export default LeaderboardList;
