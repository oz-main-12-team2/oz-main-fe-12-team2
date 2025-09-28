// src/utils/oauth.js

const POST_LOGIN_KEY = "post_login_redirect";
const EXPECTING_OAUTH_KEY = "expecting_oauth";

export function rememberPostLoginRedirect() {
  const current = window.location.pathname + window.location.search + window.location.hash;
  sessionStorage.setItem(POST_LOGIN_KEY, current || "/");
}

export function consumePostLoginRedirect() {
  const next = sessionStorage.getItem(POST_LOGIN_KEY) || "/";
  sessionStorage.removeItem(POST_LOGIN_KEY);
  return next;
}

export function markExpectingOAuth() {
  sessionStorage.setItem(EXPECTING_OAUTH_KEY, "1");
}

export function clearExpectingOAuth() {
  sessionStorage.removeItem(EXPECTING_OAUTH_KEY);
}

export function isExpectingOAuth() {
  return sessionStorage.getItem(EXPECTING_OAUTH_KEY) === "1";
}

export function getGoogleStartUrl() {
  // 백엔드의 시작 URL과 일치시켜야 함
  return "https://lov2ly.kro.kr/api/user/login/google/";
}

// (네이버 필요 시)
export function getNaverStartUrl() {
  return "https://lov2ly.kro.kr/api/user/login/naver/";
}
