const typeDefs = `#graphql
  type Mutation {
    trackVisit(path: String!, userAgent: String!): Boolean
  }

  type Query {
    _empty: String
  }
`;

export default typeDefs;
