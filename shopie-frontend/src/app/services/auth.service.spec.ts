import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { AuthService } from './auth.service';
import { LoginResponse, UserDetails, User } from '../interfaces/user';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock : HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    const mockUser=
    {
      userID: "18b68e48-9d87-4c0c-abe0-5f3c069a1a3a",
      fullName: "Mildred Ochieng",
      email: "mildred2@jitu.com",
      password: "$2b$05$Yk/BNggcVIsC/woILJBvAe6mP9aEbzEH1Sk2nzjf27KKMSaBEIZfe",
      role: "customer",
      resetToken: null,
      expiryTime: null,
      welcomed: false,
      isSend: false,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
    service.registerUser(mockUser).subscribe(res=>{
      expect(res).toEqual({"message": "User registered successfully"})
    })

    const req = httpMock.expectOne('http://localhost:3500/users/register');
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toBe(mockUser)

    req.flush({"message": "User registered successfully"})
  
  });


  it('should login a user', () => {
    const mockLoggedInUser=
    {
        userID: "18b68e48-9d87-4c0c-abe0-5f3c069a1a3a",
        fullName: "Mildred Ochieng",
        email: "mildred2@jitu.com",
        password: "$2b$05$Yk/BNggcVIsC/woILJBvAe6mP9aEbzEH1Sk2nzjf27KKMSaBEIZfe",
        role: "customer",
        resetToken: null,
        expiryTime: null,
        welcomed: false,
        isSend: false,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  
      
    }
const mockToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxOGI2OGU0OC05ZDg3LTRjMGMtYWJlMC01ZjNjMDY5YTFhM2EiLCJmdWxsTmFtZSI6Ik1pbGRyZWQgT2NoaWVuZyIsImVtYWlsIjoibWlsZHJlZDJAaml0dS5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJyZXNldFRva2VuIjpudWxsLCJleHBpcnlUaW1lIjpudWxsLCJ3ZWxjb21lZCI6ZmFsc2UsImlzU2VuZCI6ZmFsc2UsInByb2ZpbGVJbWFnZSI6Imh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA3MDAzMjExMTY5LTBhMWRkNzIyOGYyZD9xPTgwJnc9MTM3NCZhdXRvPWZvcm1hdCZmaXQ9Y3JvcCZpeGxpYj1yYi00LjAuMyZpeGlkPU0zd3hNakEzZkRCOE1IeHdhRzkwYnkxd1lXZGxmSHg4ZkdWdWZEQjhmSHg4ZkElM0QlM0QiLCJpYXQiOjE3MDE0MTkwNDAsImV4cCI6MTcwMTU5MTg0MH0.A7vn9etHX87P5EcpqpSeuNqvsW8KLsarbuuumPaBu2U"



    service.login(mockLoggedInUser).subscribe((res: LoginResponse) => {
    expect(res).toBeDefined();
    expect(res.message).toBe("User Logged in successfully");
    expect(res.token).toBe( mockToken);
    expect(localStorage.getItem('token')).toBe(res.token);

     const req = httpMock.expectOne('http://localhost:3500/users/login/');
  expect(req.request.method).toEqual('POST');
  expect(req.request.body).toEqual(mockLoggedInUser);

    req.flush({"message": "User Logged in successfully"})
    req.flush({ token: 'mockToken' });

  });
});



// describe('AuthService', () => {




//   it('should get user details', () => {
//     const mockUserDetails: UserDetails[] = [
      
//     ];

//     service.getUserDetails().subscribe((res) => {
//       expect(res).toEqual(mockUserDetails);
//       // add more expectations if needed
//     });

//     const req = httpMock.expectOne('http://localhost:3500/users/userDetails/');
//     expect(req.request.method).toEqual('GET');
//     req.flush(mockUserDetails);
//   });

// 
});