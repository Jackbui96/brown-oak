const axios = require("axios");

const logResumeDownload = async () => {
    const mutation = `
    mutation {
        recordDownload {
            success
            timestamp
        }
    }
    `;

    await axios.post("http://localhost:4000/graphql", {
        query: mutation,
    });
};

module.exports = {
    logResumeDownload,
}
