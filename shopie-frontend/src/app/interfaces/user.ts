export interface User {
    userID: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    profileImage: string
}


  export interface LoginResponse {
    user: User | undefined;
    token: string;
    userID:string
    message?: string;
  }

  export interface userLogin {
    email: string,
    password : string
}


export interface UserDetails {
  userID:string;
  fullName: string;
  email: string;
  role:string;
  profileImage: string
}

export interface updatedUserData {
  userID:string;
  fullName: string;
  email: string;
 profileImage: string;
};



export interface Person extends User{
  age: number;
}

export interface Guy extends Person{
  profession:string;
  color:string;
}