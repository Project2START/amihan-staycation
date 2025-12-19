"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HOST } from "../constants/config";

const client = new ApolloClient({
  link: new HttpLink({ uri: `${HOST}/graphql` }),
  cache: new InMemoryCache(),
});

export default function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
