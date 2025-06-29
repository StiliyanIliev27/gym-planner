// Helper to generate a random 6-digit code
function generateConfirmationCode(length = 6) {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, length);
}

export default generateConfirmationCode;