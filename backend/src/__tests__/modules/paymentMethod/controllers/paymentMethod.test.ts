import { paymentMethodController } from "../../../../modules/paymentMethod/controllers/paymentMethod.controller";
import { paymentMethodService } from "../../../../modules/paymentMethod/services/paymentMethod.service";

jest.mock("../../../../modules/paymentMethod/services/paymentMethod.service");

describe("PaymentMethodController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      file: {},
      params: { id: "pm1" },
      query: {},
      user: { user_id: "u1" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it("createPaymentMethod calls service and returns 201", async () => {
    (paymentMethodService.create as jest.Mock).mockResolvedValue(undefined);

    await paymentMethodController.createPaymentMethod(req, res);

    expect(paymentMethodService.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment method successfully created",
    });
  });

  it("getPaymentMethod returns payment method from service", async () => {
    const pm = { id: "pm1" };
    (paymentMethodService.get as jest.Mock).mockResolvedValue(pm);

    await paymentMethodController.getPaymentMethod(req, res);

    expect(paymentMethodService.get).toHaveBeenCalledWith("pm1", "u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment method product successfully fetched",
      payment_method: pm,
    });
  });

  it("getAllPaymentMethods calls service and returns list", async () => {
    const arr = [{ id: "pm1" }];
    (paymentMethodService.getAllById as jest.Mock).mockResolvedValue(arr);

    await paymentMethodController.getAllPaymentMethods(req, res);

    expect(paymentMethodService.getAllById).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment methods successfully fetched",
      payment_methods: arr,
    });
  });

  it("updatePaymentMethod calls service and returns 200", async () => {
    (paymentMethodService.update as jest.Mock).mockResolvedValue(undefined);

    await paymentMethodController.updatePaymentMethod(req, res);

    expect(paymentMethodService.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment method successfully updated",
    });
  });

  it("deletePaymentMethod calls service and returns 200", async () => {
    (paymentMethodService.delete as jest.Mock).mockResolvedValue(undefined);

    await paymentMethodController.deletePaymentMethod(req, res);

    expect(paymentMethodService.delete).toHaveBeenCalledWith("pm1", "u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment method product successfully deleted",
    });
  });
});
