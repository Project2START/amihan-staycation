import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/helpers/appErrors";
import { globalErrorHandler } from "../../middleware/globalErrorHandler";

describe("globalErrorHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("handles AppError correctly", () => {
    const error = new AppError("Custom error", 409);

    globalErrorHandler(error, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Custom error" });
  });

  it("handles ZodError correctly", () => {
    // Construct a minimal valid ZodError
    const zodError = new ZodError([
      {
        code: "invalid_type",
        path: ["name"],
        message: "Name must be a string",
      } as any, // cast as any to satisfy TypeScript
    ]);

    globalErrorHandler(zodError, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Name must be a string"],
    });
  });

  it("handles unknown errors correctly", () => {
    const error = new Error("Unexpected error");

    globalErrorHandler(error, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong. Please try again later",
    });
  });

  it("handles primitive error values", () => {
    globalErrorHandler("string error" as unknown, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong. Please try again later",
    });
  });
});
