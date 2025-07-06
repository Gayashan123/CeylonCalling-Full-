export function sessionAuth(req, res, next) {
  if (req.session && req.session.siteuserId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
