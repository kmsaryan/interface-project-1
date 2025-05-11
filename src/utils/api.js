const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/users/login`,
  register: `${API_BASE_URL}/api/users/register`,
  refreshToken: `${API_BASE_URL}/api/users/refresh-token`,
  
  // User endpoints
  users: `${API_BASE_URL}/api/users`,
  dealerCustomers: `${API_BASE_URL}/api/dealer/customers`,
  dealerTechnicians: `${API_BASE_URL}/api/dealer/technicians`,
  dealerUsers: `${API_BASE_URL}/api/dealer/users`,
  
  // File endpoints
  fileUpload: `${API_BASE_URL}/file/upload`,
  fileDownload: (id) => `${API_BASE_URL}/file/download/${id}`,
  
  // Other endpoints
  protected: `${API_BASE_URL}/api/protected`,
  executeQuery: `${API_BASE_URL}/api/db/execute`,
};

export default api;
