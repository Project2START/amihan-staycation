import { registreeRepository } from "../modules/registree/repositories/registree.repository";

export const resolvers = {
  Query: {
    registree: async (_parent: any, args: { id: string }) => {
      const registree = await registreeRepository.findById(args.id);
      return {
        ...registree,
        nextAllowedResend: `${registree?.nextAllowedResend}`,
      };
    },
  },
};
