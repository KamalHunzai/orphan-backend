const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.status(401).json({ message: "No token provided. Please login first." });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "SuperAdmin access required" });
  }
  next();
};

const requireChild = (req, res, next) => {
  if (req.user?.role !== "child") {
    return res.status(403).json({ message: "Child access required" });
  }
  next();
};

const requireAdminOrSuperAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Admin or SuperAdmin access required" });
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireSuperAdmin, requireChild, requireAdminOrSuperAdmin };
