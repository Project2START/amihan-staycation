import { NextFunction, Request, Response } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

type IdentifierResolver = (req: Request) => string | null | undefined;

type RateLimitPolicy = {
  name: string;
  windowMs: number;
  max: number;
  keyPrefix?: string;
  identifierResolver?: IdentifierResolver;
  skip?: (req: Request) => boolean;
};

const DEFAULT_WHITELIST = (process.env.RATE_LIMIT_WHITELIST ?? "")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

const extractIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]?.split(",")[0]?.trim() || req.ip || "unknown";
  }

  return req.ip || req.socket.remoteAddress || "unknown";
};

const isWhitelisted = (req: Request): boolean => {
  if (DEFAULT_WHITELIST.length === 0) {
    return false;
  }

  const clientIp = extractIp(req);
  return DEFAULT_WHITELIST.includes(clientIp);
};

const defaultIdentifierResolver: IdentifierResolver = (req) => {
  const authUserId = (req as any).user?.user_id;
  if (authUserId) {
    return `user:${authUserId}`;
  }

  return `ip:${extractIp(req)}`;
};

const toSeconds = (milliseconds: number) =>
  Math.max(0, Math.ceil(milliseconds / 1000));

export const createRateLimiter = (
  policy: RateLimitPolicy,
): RateLimitRequestHandler => {
  const {
    name,
    windowMs,
    max,
    keyPrefix = "global",
    identifierResolver = defaultIdentifierResolver,
    skip,
  } = policy;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-6",
    legacyHeaders: false,
    skip: (req) => {
      if (isWhitelisted(req)) {
        return true;
      }

      return skip ? skip(req) : false;
    },
    keyGenerator: (req) => {
      const identifier = identifierResolver(req) || "unknown";
      return `${keyPrefix}:${identifier}`;
    },
    handler: (req: Request, res: Response) => {
      const limit = Number(res.getHeader("RateLimit-Limit")) || max;
      const remaining = Number(res.getHeader("RateLimit-Remaining")) || 0;
      const resetRaw = res.getHeader("RateLimit-Reset");
      const resetSeconds = Number(resetRaw);

      const safeResetSeconds = Number.isFinite(resetSeconds)
        ? resetSeconds
        : toSeconds(windowMs);

      res.setHeader("RateLimit-Limit", String(limit));
      res.setHeader("RateLimit-Remaining", String(remaining));
      res.setHeader("RateLimit-Reset", String(safeResetSeconds));

      console.warn(
        `[RATE_LIMIT] policy=${name} identifier=${defaultIdentifierResolver(req)} method=${req.method} path=${req.originalUrl}`,
      );

      res.status(429).json({
        message: "Too many requests. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        policy: name,
        retryAfterSeconds: safeResetSeconds,
      });
    },
  });
};

export const globalApiRateLimiter = createRateLimiter({
  name: "global-api",
  windowMs: Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS ?? 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_GLOBAL_MAX ?? 300),
  keyPrefix: "api",
  skip: (req) => {
    return (
      req.path === "/users/sign-in" ||
      req.path === "/users/sign-up" ||
      req.path.startsWith("/users/password-reset")
    );
  },
});

export const globalGraphqlRateLimiter = createRateLimiter({
  name: "global-graphql",
  windowMs: Number(process.env.RATE_LIMIT_GRAPHQL_WINDOW_MS ?? 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_GRAPHQL_MAX ?? 200),
  keyPrefix: "graphql",
});

export const strictAuthRateLimiter = createRateLimiter({
  name: "strict-auth",
  windowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS ?? 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_AUTH_MAX ?? 10),
  keyPrefix: "auth",
  identifierResolver: (req) => {
    const email = req.body?.email;
    if (typeof email === "string" && email.length > 0) {
      return `email:${email.toLowerCase()}`;
    }

    return `ip:${extractIp(req)}`;
  },
});

export const passwordResetRateLimiter = createRateLimiter({
  name: "password-reset",
  windowMs: Number(process.env.RATE_LIMIT_RESET_WINDOW_MS ?? 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_RESET_MAX ?? 5),
  keyPrefix: "password-reset",
  identifierResolver: (req) => {
    const email = req.body?.email;
    if (typeof email === "string" && email.length > 0) {
      return `email:${email.toLowerCase()}`;
    }

    return `ip:${extractIp(req)}`;
  },
});

export const trustProxyValue = (() => {
  const rawValue = (process.env.TRUST_PROXY ?? "").trim().toLowerCase();

  if (!rawValue) {
    return 1;
  }

  if (rawValue === "true") {
    return true;
  }

  if (rawValue === "false") {
    return false;
  }

  const asNumber = Number(rawValue);
  if (Number.isFinite(asNumber)) {
    return asNumber;
  }

  return rawValue;
})();

export const attachRateLimitHeaders =
  (limit: number, remaining: number, resetInMs: number) =>
  (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("RateLimit-Limit", String(limit));
    res.setHeader("RateLimit-Remaining", String(Math.max(remaining, 0)));
    res.setHeader("RateLimit-Reset", String(toSeconds(resetInMs)));
    next();
  };
