// Dropdown list to select a user
import PropTypes from "prop-types";

function UserDropdown({ users, selectedUserId, setSelectedUserId }) {
  return (
    <select
      className="p-2 border rounded w-full sm:w-60 bg-white shadow-sm"
      value={selectedUserId}
      onChange={(e) => setSelectedUserId(e.target.value)}
    >
      <option value="" disabled>Select a user</option>
      {users.map((user) => (
        <option
          key={user._id}
          value={user._id}
          className={
            user._id === selectedUserId ? "bg-blue-100" : "bg-white"
          }
        >
          {user.name}
        </option>
      ))}
    </select>
  );
}

UserDropdown.propTypes = {
  users: PropTypes.array.isRequired,
  selectedUserId: PropTypes.string.isRequired,
  setSelectedUserId: PropTypes.func.isRequired,
};

export default UserDropdown;
