import { findOrCreateUser } from "../../databases/moodie/userRepo.js";

const handleGoogleSignin = async (req, res) => {
    const { firebaseId, email, displayName, photoURL } = req.body;

    try {
        const result = await findOrCreateUser(firebaseId, email, displayName, photoURL);

        res.status(200).send({ result });
    } catch (err) {
        console.error("err: ", err)
        res.status(500).send({ error: "Failed to find user" });
    }
};

export default handleGoogleSignin;
