import { getUserModel } from "../../models/modelFactory.js";

const resolvers = {
    Query: {
        trafficUser: async (_, { phoneNumber }) => {
            const User = getUserModel("traffic-monitor");
            return User.findOne({ phoneNumber });
        },
    },
    Mutation: {},
};

export default resolvers;
