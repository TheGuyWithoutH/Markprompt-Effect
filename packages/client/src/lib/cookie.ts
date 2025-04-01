// Set a cookie for the API key
const setApiKeyCookie = (apiKey: string) => {
  document.cookie = `api_key=${apiKey}; path=/`;
};

// Get the API key from the cookie
const getApiKeyCookie = () => {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)api_key\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
};

export { setApiKeyCookie, getApiKeyCookie };
