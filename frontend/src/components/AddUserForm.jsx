// Form to add a new user to the leaderboard
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";

function AddUserForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!name.trim()) {
      toast.error("Enter a name first.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users", { name });
      setName("");
      toast.success("User added successfully!");
      onSuccess(); // Refresh user list in parent
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error(err.response?.data?.message || "Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        placeholder="Add new user"
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded w-full sm:w-52"
      />
      <button
        onClick={handleAddUser}
        disabled={loading}
        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Adding..." : "➕ Add"}
      </button>
    </div>
  );
}

AddUserForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default AddUserForm;
