const typeDefs = `#graphql
  type DownloadLog {
    _id: ID!
    timestamp: String!
    ip: String
    userAgent: String
    source: String
  }

  type Mutation {
    recordResumeDownload(source: String): DownloadLog
  }

  type Query {
    downloads(limit: Int): [DownloadLog]
    downloadCount: Int
  }
`;

module.exports = typeDefs;
