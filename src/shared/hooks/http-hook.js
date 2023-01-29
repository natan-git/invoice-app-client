import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method: method, // method: method === method
          body: body,
          headers: headers,
          signal: httpAbortController.signal,
        });
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );

        const responseData = await response.json();
        if (!response.ok) {
          // runs if we have some 400 || 500 codes error
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message || "something went wrong, please try again");
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
