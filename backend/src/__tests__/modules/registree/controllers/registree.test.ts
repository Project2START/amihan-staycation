import { registreeController } from "../../../../modules/registree/controllers/registree.controller";
import { registreeService } from "../../../../modules/registree/services/registree.service";

jest.mock("../../../../modules/registree/services/registree.service");

describe("RegistreeController.register", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      },
    };

    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a registree, set cookie, and return 201", async () => {
    const mockRegistree = {
      id: "abc123",
      codeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes later
    };

    (registreeService.create as jest.Mock).mockResolvedValue(mockRegistree);

    await registreeController.register(req, res);

    // Check service call
    expect(registreeService.create).toHaveBeenCalledWith(req.body);

    // Check response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registree successfully created",
      registree_id: mockRegistree.id,
      cookieMaxAge: expect.any(Number),
    });
  });

  it("should propagate errors from registreeService.create", async () => {
    const error = new Error("DB failure");
    (registreeService.create as jest.Mock).mockRejectedValue(error);

    await expect(registreeController.register(req, res)).rejects.toThrow(
      "DB failure"
    );

    // Ensure nothing else was called
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
