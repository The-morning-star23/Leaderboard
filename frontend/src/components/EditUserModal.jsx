import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

function EditUserModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
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

    try {
      setLoading(true);
      await api.patch(`/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User updated");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="User Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Modern avatar upload button */}
          <label className="relative cursor-pointer bg-white border px-3 py-2 rounded shadow-sm hover:bg-gray-50 transition text-sm text-gray-700 inline-block">
            📷 Upload New Avatar
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatarFile(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          {preview && (
            <div className="flex justify-center mt-2">
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditUserModal.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EditUserModal;
