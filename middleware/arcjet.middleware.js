import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    // Log request details for debugging
    console.log("Request details:", {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      method: req.method,
      url: req.url,
    });

    const decision = await aj.protect(req, { requested: 1 });

    // Log Arcjet decision detailsZn
    console.log("Arcjet decision:", {
      isAllowed: decision.isAllowed(),
      isDenied: decision.isDenied(),
      reason: decision.reason,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Rate limit exceeded",
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          message: "Bot detected",
          reason: decision.reason, // Include reason for debugging
        });
      }

      return res.status(403).json({
        success: false,
        message: "Request denied",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error.message);
    next(error);
  }
};

export default arcjetMiddleware;