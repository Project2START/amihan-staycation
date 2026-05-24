export const registreeTypeDefs = `#graphql
    type Registree {
        nextAllowedResend: String
    }

    extend type Query {
        registree(id: ID!): Registree
    }
    `;
