import rateLimit from "express-rate-limit";

export const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // Limit each IP to 100 uploads per day
  message: "Daily upload limit exceeded",
  standardHeaders: true,
  legacyHeaders: false,
});

export const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // Limit each IP to 1000 downloads per day
  message: "Daily download limit exceeded",
  standardHeaders: true,
  legacyHeaders: false,
});
