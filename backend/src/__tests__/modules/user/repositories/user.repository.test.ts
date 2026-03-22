jest.mock("@prisma/client", () => {
  const create = jest.fn();
  const findUnique = jest.fn();
  const update = jest.fn();
  const del = jest.fn();

  const mockInstance = { users: { create, findUnique, update, delete: del } };

  const PrismaClient = jest.fn().mockImplementation(() => mockInstance);

  return { PrismaClient, __mockInstance: mockInstance };
});

import { userRepository } from "../../../../modules/user/repositories/user.repository";
import { ConflictError } from "../../../../shared/helpers/appErrors";

describe("UserRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create returns created user", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;
    const user = { id: "u1", email: "a@b.com" };
    instance.users.create.mockResolvedValue(user);

    const res = await userRepository.create({} as any);

    expect(res).toEqual(user);
    expect(instance.users.create).toHaveBeenCalled();
  });

  it("create throws ConflictError on P2002", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;
    const err: any = new Error("unique");
    err.code = "P2002";
    instance.users.create.mockRejectedValue(err);

    await expect(userRepository.create({} as any)).rejects.toThrow(
      ConflictError,
    );
  });

  it("findById returns null when not found", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;
    instance.users.findUnique.mockResolvedValue(null);

    const res = await userRepository.findById("nope");

    expect(res).toBeNull();
  });
});
