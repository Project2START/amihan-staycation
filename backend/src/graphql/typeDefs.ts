export const typeDefs = `
    type Registree {
    nextAllowedResend: String
    }

    type Query {
        registree(id: ID!): Registree
    }
    `;
