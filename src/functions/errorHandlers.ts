export function handleAuthError(
  error: any,
  setError: (message: string) => void
) {
  if (error.response && error.response.status === 401) {
    const message = error.response.data.message;
    if (message === 'Init data expired, please re-authenticate') {
      // window.location.reload();
      // window.Telegram.WebApp.close();
    } else {
      setError(`Authentication error: ${message}`);
    }
  } else {
    setError(error.response?.data.message || error.message || String(error));
  }
}
