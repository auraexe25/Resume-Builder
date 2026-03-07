import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BASE_URL ||
    "https://resume-builder-1513.onrender.com";

const api= axios.create({
        baseURL
})

export default api