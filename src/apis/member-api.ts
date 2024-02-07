/* MEMBER API */
export const MEMBER_BASE_URL = (memberId: number) =>
  `${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}`;

export const CHANGE_PASSWORD_URL = (memberId: number) =>
  MEMBER_BASE_URL(memberId) + "/password";
