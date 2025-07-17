// Button to claim random points for a selected user
import PropTypes from "prop-types";
import api from "../api";
import { useState } from "react";
import { toast } from "react-hot-toast";

function ClaimButton({ selectedUserId, setClaimedPoints, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/claim", { userId: selectedUserId });
      const { points } = res.data;
      setClaimedPoints(points);
      toast.success(`🎯 Claimed ${points} points!`);
      onSuccess(); // Trigger refresh in parent
    } catch (err) {
      console.error("Error claiming points:", err);
      toast.error("Failed to claim points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Claiming..." : "🎯 Claim Points"}
    </button>
  );
}

ClaimButton.propTypes = {
  selectedUserId: PropTypes.string.isRequired,
  setClaimedPoints: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ClaimButton;
