import { registreeRepository } from "../repositories/registree.repository";

export const registreeResolvers = {
  Query: {
    registree: async (_parent: any, args: { id: string }) => {
      const registree = await registreeRepository.findById(args.id);
      return registree;
    },
  },
};
