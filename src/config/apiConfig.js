// apiConfig.js

//export const API_URL = "http://127.0.0.1:8000" ;  
// export const API_HOST = "127.0.0.1:8000";
 export const API_URL =  "https://backend.dalstores.com.ng" ; //  
 export const API_HOST = "https://backend.dalstores.com.ng";


export const getAuthConfig = (userInfo) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userInfo.access}`,
  },
});

export const getAuthConfigAny = () => ({
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthConfigMultipart = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userInfo.access}`
    }
  };
};