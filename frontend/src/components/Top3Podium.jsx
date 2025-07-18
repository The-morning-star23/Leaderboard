import PropTypes from "prop-types";
import getInitials from "../utils/getInitials";

const rankStyles = {
  1: {
    bg: "bg-gradient-to-t from-yellow-200 to-yellow-50",
    shadow: "shadow-yellow-400/50",
    icon: "🥇",
  },
  2: {
    bg: "bg-gradient-to-t from-gray-300 to-white",
    shadow: "shadow-gray-300/50",
    icon: "🥈",
  },
  3: {
    bg: "bg-gradient-to-t from-orange-200 to-orange-50",
    shadow: "shadow-orange-400/50",
    icon: "🥉",
  },
};

function Top3Podium({ topThree }) {
  if (!topThree || topThree.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-end gap-4 sm:gap-8 mb-8">
      {topThree.map((user, idx) => {
        const rank = idx + 1;
        const styles = rankStyles[rank] || {};
        const isCenter = rank === 1;

        return (
          <div
            key={user._id}
            className={`flex flex-col items-center justify-end 
            p-4 w-32 sm:w-36 rounded-xl shadow-lg ${styles.bg} 
            ${styles.shadow} ${isCenter ? "sm:mb-0" : "sm:mb-4"}`}
          >
            <div className="text-2xl mb-1" title={`${rank === 1 ? "1st Place" : rank === 2 ? "2nd Place" : "3rd Place"}`}>
                {styles.icon}
            </div>

            {user.avatarUrl ? (
                <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                />
            ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2 ${
                    isCenter ? "bg-yellow-500" : "bg-blue-600"
                }`}>
                    {getInitials(user.name)}
                </div>
            )}
            <div className="text-center">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-600 truncate">
                ID: {user._id.slice(-4)}
              </div>
              <div className="text-sm font-bold mt-1">
                <span title="Total points earned in this leaderboard">💠 {user.totalPoints}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Top3Podium.propTypes = {
  topThree: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      totalPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Top3Podium;
