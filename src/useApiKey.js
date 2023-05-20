// useApiKey.js

import { useState, useEffect } from 'react';

const useApiKey = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);

  const getApiKey = () => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: '736f6ec7f34c46688a7f2cd4f18243d4',
        client_secret: 'fbe6a8c23ed24b9eb53af64aa590095a',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.access_token);
        const expirationTime = new Date().getTime() + data.expires_in * 1000;
        localStorage.setItem('apiKey', data.access_token);
        localStorage.setItem('expirationTime', expirationTime.toString());
      });
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();

    if (storedApiKey && expirationTime && currentTime < expirationTime) {
      // API key exists in localStorage and has not expired
      setApiKey(storedApiKey);
      setApiKeySet(true);
    } else {
      // API key doesn't exist or has expired, fetch a new one
      getApiKey();
    }
  }, []);

  return { apiKey, apiKeySet };
};

export default useApiKey;
