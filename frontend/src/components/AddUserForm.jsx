import { useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import toast from "react-hot-toast";

function AddUserForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    setLoading(true);
    try {
      await api.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User added!");
      setName("");
      setAvatarFile(null);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddUser}
      className="flex flex-col sm:flex-row items-center gap-2"
    >
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded w-full sm:w-auto"
      />

      <label className="relative cursor-pointer bg-white text-sm border px-3 py-2 rounded shadow hover:bg-gray-50 transition text-gray-700">
        📷 Upload Avatar
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>

      {avatarFile && (
        <div className="mt-2 sm:mt-0">
          <img
            src={URL.createObjectURL(avatarFile)}
            alt="Avatar Preview"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}

AddUserForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default AddUserForm;
