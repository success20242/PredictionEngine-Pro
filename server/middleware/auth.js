function auth(req, res, next) {
  const key = req.headers.authorization;

  if (key !== process.env.PRO_API_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

module.exports = auth;
