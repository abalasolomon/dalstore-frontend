// Utility function to determine redirect path based on user role and email verification status

export const getRedirectPath = async (userInfo) => {
  if (!userInfo || !userInfo.is_email_verified) { 
    localStorage.setItem("registrationData", JSON.stringify(userInfo));
    return "/verify-email-otp";
  }

  if(userInfo?.is_staff || userInfo?.superuser){
    return "/admin/dashboard";
  }

  return "/";
};
