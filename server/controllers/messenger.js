const fetch = require("node-fetch");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const sendOrderMessage = asyncHandler(async (req, res) => {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  const recipientId = req.body.psid;
  const text = req.body.text;
  if (!token) throw new AppError("FACEBOOK_PAGE_TOKEN missing", 500);
  if (!recipientId) throw new AppError("psid is required", 400);
  if (!text || !String(text).trim()) throw new AppError("text is required", 400);
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${token}`;
  const body = {
    recipient: { id: recipientId },
    message: { text },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new AppError(String(data.error?.message || "Failed to send message"), 500);
  res.status(200).json({ ok: true, id: data.message_id });
});

module.exports = { sendOrderMessage };