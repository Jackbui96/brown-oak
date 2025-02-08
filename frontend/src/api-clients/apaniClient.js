import axios from "axios";

const apaniClient = axios.create({ baseURL: "https://a-pani.com/api/v1/" })
export default apaniClient