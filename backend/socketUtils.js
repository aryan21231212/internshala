
let io = null;

const setIOInstance = (ioInstance) => {
  io = ioInstance;
};

const sendStatusNotification = (userId, status) => {
  if (!io) return;

  const messages = {
    accepted: "🎉 Congratulations! You've been hired.",
    rejected: "❌ Unfortunately, your application was rejected.",
  };

  const msg = messages[status.toLowerCase()] || "📢 Your application status has been updated.";

  io.to(userId).emit("application-status-changed", {
    status,
    message: msg,
  });

  console.log(`Notification sent to ${userId}: ${msg}`);
};

module.exports = {
  setIOInstance,
  sendStatusNotification,
};
