export interface User {
  Id: string;
  Name: string;
  MobileNo: string;
  Email: string;
  Password: string;
  Role: string;
  IsDeleted: boolean;
}

export interface LoginDetails {
  AccessToken: string;
}
