import axios from "axios"
import { AXIOS_BASE_URL } from "../utils/constants"

const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  withCredentials: true,
})

export default axiosInstance
