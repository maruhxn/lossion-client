export interface User {
  id: number;
  accountId: string;
  email: string;
  username: string;
  profileImage: string;
}

export interface UserDetail extends User {
  isVerified: boolean;
}
