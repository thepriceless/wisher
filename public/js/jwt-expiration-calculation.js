const SECONDS_IN_A_DAY = 86400;
const TOKEN_VALID_DAYS = 14;

function calculateExpirationTimeForJwt() {
  let now = new Date();
  let time = now.getTime();
  let expireTime = time + TOKEN_VALID_DAYS * SECONDS_IN_A_DAY * 1000;
  now.setTime(expireTime);
  return now.toUTCString();
}
