const typeDefs = `#graphql
type MoodieUser {
    _id: ID!
    firebaseId: String
    email: String
    favoriteMovies: [String]
    registered: String
    lastLoggedIn: String
}

type Query {
    moodieUser(firebaseId: String!): MoodieUser
}

type Mutation {
    toggleFavorite(movieId: String!, action: String!): Boolean
}
`;

export default typeDefs;
