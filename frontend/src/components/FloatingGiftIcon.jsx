import { useState } from "react";
import { Gift } from "lucide-react";

function FloatingGiftIcon() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      <div
        className="fixed top-4 right-4 z-20 cursor-pointer bg-white rounded-full p-2 shadow-lg hover:scale-105 transition-transform"
        onClick={() => setShowModal(true)}
        title="Claim Rewards"
      >
        <Gift className="w-6 h-6 text-yellow-500" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-2">🎁 Rewards Center</h3>
            <p className="text-sm text-gray-600 mb-4">
              Stay tuned! Rewards and bonuses will appear here.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-4 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingGiftIcon;
