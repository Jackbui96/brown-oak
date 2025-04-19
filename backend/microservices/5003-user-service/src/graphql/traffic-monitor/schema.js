const typeDefs = `#graphql

type TrafficUser {
    _id: ID!
    phoneNumber: String
    registered: String
    lastLoggedIn: String
}

type Query {
    trafficUser(phoneNumber: String!): TrafficUser
}

type Mutation {
    _empty: String
}
`;

export default typeDefs;
