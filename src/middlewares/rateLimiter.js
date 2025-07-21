const rateMap = new Map();
const LIMIT = 100 * 1024 * 1024; // 100MB/day

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const today = new Date().toDateString();

  if (!rateMap.has(ip)) {
    rateMap.set(ip, { date: today, usage: 0 });
  }

  const usage = rateMap.get(ip);
  if (usage.date !== today) {
    usage.date = today;
    usage.usage = 0;
  }

  const size = parseInt(req.headers["content-length"]) || 0;
  if (usage.usage + size > LIMIT) {
    return res.status(429).json({ error: "Daily bandwidth limit exceeded" });
  }

  usage.usage += size;
  next();
};

export default rateLimiter;
