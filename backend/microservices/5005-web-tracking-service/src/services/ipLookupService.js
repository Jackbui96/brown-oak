import axios from "axios";

const IP_APU_CO_URL = "https://ipapi.co/";

const getClientIp = (req) => {
    return req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;
};

const getGeoInfo = async (ip) => {
    try {
        const res = await axios.get(`${IP_APU_CO_URL}${ip}/json/`);
        const data = res.data;
        return {
            city: data.city || "Unknown",
            zip: data.postal || "Unknown"
        };
    } catch {
        return { city: "Unknown", zip: "Unknown" };
    }
};

export {
    getClientIp,
    getGeoInfo,
}
