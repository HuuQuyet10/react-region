export interface PermisionItem {
  description: string,
  name: string,
}

export interface UserLoginResponse {
  id: number,
  birthDay: string,
  email: string,
  userName: string,
  fullName: string,
  jobTypes: number[],
  language: string,
  phone: string | any,
  roles: number[],
  status: string,
}