// shared/config.ts

export const API_BASE_URL = "http://localhost:5181"; // можешь взять из .env позже

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/Auth/login`
    },
    CERTIFICATES: {
        BASE: `${API_BASE_URL}/api/certificates`,
        getById: (id: number | string) => `${API_BASE_URL}/api/certificates/${id}`
    },
    USERS: {
        getRole: (wallet: string) => `${API_BASE_URL}/api/users/role/${wallet}`
    }
};
