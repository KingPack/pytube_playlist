import { handleApiError } from "../utils/errorHandler";

export function setupInterceptors(api) {

  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );
}
