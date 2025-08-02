export const API_BASE_URL = "http://localhost:5181"; // TODO: заменить на process.env.API_BASE_URL при деплое

export const API_ENDPOINTS = {
    AUTH: {
        NONCE: `${API_BASE_URL}/api/auth/nonce`,
        LOGIN: `${API_BASE_URL}/api/auth/login`, // 👈 фикс регистра
    },
    CERTIFICATES: {
        BASE: `${API_BASE_URL}/api/certificates`,
        getById: (id: number | string) => `${API_BASE_URL}/api/certificates/${id}`,
        revoke: (id: number | string) => `${API_BASE_URL}/api/certificates/${id}/revoke`,
        issuedByMe: `${API_BASE_URL}/api/certificates/issued`,
        ownedBy: (address: number | string) => `${API_BASE_URL}/api/certificates/owned-by/${address}`,


    },
    USERS: {
        ALL: `${API_BASE_URL}/api/users`,
        SET_ROLE: `${API_BASE_URL}/api/admin/setRole`, // 👈 фикс роутинга по REST
    }
};
