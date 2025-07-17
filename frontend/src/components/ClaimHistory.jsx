// Shows a scrollable list of all claim events
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../api";
import getInitials from "../utils/getInitials";

function ClaimHistory({ refresh }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/claims/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch claim history:", err);
      }
    };

    fetchHistory();
  }, [refresh]);

  return (
    <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">📜 Claim History</h2>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {history.length === 0 && (
          <li className="text-gray-500 text-center">No claims yet.</li>
        )}
        {history.map((entry) => (
          <li
            key={entry._id}
            className="border-b pb-2 text-sm flex justify-between"
          >
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {getInitials(entry.user?.name || "")}
              </div>
              <span>
                <strong>{entry.user?.name || "Unknown"}</strong> claimed{" "}
                <strong>{entry.points}</strong> points
              </span>
            </span>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {new Date(entry.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

ClaimHistory.propTypes = {
  refresh: PropTypes.bool.isRequired,
};

export default ClaimHistory;
