import { getOneUser, updateOne, } from "../../databases/moodie/userRepo.js";

const resolvers = {
    Query: {
        moodieUser: async (_, { firebaseId }) => {
            return await getOneUser(firebaseId);
        },
    },
    Mutation: {
        toggleFavorite: async (_, { movieId, action }, { user }) => {
            if (!user || !user.firebaseId) {
                throw new Error("Unauthorized");
            }

            if (!["add", "remove"].includes(action)) {
                throw new Error("Invalid action");
            }

            const update = action === "add"
                ? { $addToSet: { favoriteMovies: movieId } }
                : { $pull: { favoriteMovies: movieId } };

            return await updateOne(user.firebaseId, update);
        }
    },
};

export default resolvers;
