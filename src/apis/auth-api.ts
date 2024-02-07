/* AUTH API */
export const AUTH_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const LOGIN_URL = `${AUTH_BASE_URL}/login`;
export const SIGNUP_URL = `${AUTH_BASE_URL}/sign-up`;
export const REFRESH_URL = `${AUTH_BASE_URL}/refresh`;
export const SEND_VERIFY_EMAIL_URL = `${AUTH_BASE_URL}/send-verify-email`;
export const VERIFY_EMAIL_URL = `${AUTH_BASE_URL}/verify-email`;
export const VERIFY_PASSWORD_URL = `${AUTH_BASE_URL}/verify-password`;
export const ANONYMOUS_SEND_VERIFY_EMAIL_URL = `${AUTH_BASE_URL}/anonymous/send-verify-email`;
export const ANONYMOUS_GET_TOKEN_URL = `${AUTH_BASE_URL}/anonymous/get-token`;
export const ANONYMOUS_CHANGE_PASSWORD_URL = `${AUTH_BASE_URL}/anonymous/password`;
export const LOGOUT_URL = `${AUTH_BASE_URL}/logout`;

/* OAUTH2 */
export const GOOGLE_LOGIN_URL = `${AUTH_BASE_URL}/oauth2/google`;
export const KAKAO_LOGIN_URL = `${AUTH_BASE_URL}/oauth2/kakao`;
export const NAVER_LOGIN_URL = `${AUTH_BASE_URL}/oauth2/naver`;
