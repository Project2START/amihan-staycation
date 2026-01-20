import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../shared/helpers/jwt";
import { authMiddleware } from "../../middleware/authMiddleware";

jest.mock("../../shared/helpers/jwt");

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("calls next() and sets req.user when token is valid", () => {
    const mockDecoded = { user_id: "u1" };
    (verifyToken as jest.Mock).mockReturnValue(mockDecoded);

    req.headers = { authorization: "Bearer valid-token" };

    authMiddleware(req as any, res as any, next);

    expect(verifyToken).toHaveBeenCalledWith("valid-token");
    expect((req as any).user).toEqual(mockDecoded);
    expect(next).toHaveBeenCalled();
  });

  it("returns 401 if no Authorization header", () => {
    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token is missing after Bearer", () => {
    req.headers = { authorization: "Bearer " }; // empty token
    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token is invalid or verifyToken throws", () => {
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("invalid");
    });
    req.headers = { authorization: "Bearer invalid-token" };

    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
