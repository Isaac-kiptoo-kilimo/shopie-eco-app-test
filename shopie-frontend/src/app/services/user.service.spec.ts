import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { User, UserDetails, updatedUserData } from '../interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock : HttpTestingController
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService,]
    });
    service = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should get Users', () => {
    const mockUsers=[
        {
          userID: "0df09010-748d-40a4-a46c-8443aed78f6c",
          fullName: "Noel Jepkemoi",
          email: "noelajepkemoi@gmail.com",
          password: "$2b$05$8JJwOTACRT2TtR02/jJgAOJL9lINDPS7rnVImnzGmWI44.WkoMA2u",
          role: "customer",
          resetToken: null,
          expiryTime: null,
          welcomed: false,
          isSend: false,
          profileImage: "assets/images/i"
        },
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
    ]
    service.getUsers().subscribe(res=>{
      expect(res).toEqual(mockUsers)
    })

    const req = httpMock.expectOne('http://localhost:4400/employee');
    expect(req.request.method).toBe('GET')
  });



  it('should check user details', () => {
    const mockUser: any =[
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
    ] ;
    authService.getUserDetails.and.returnValue(of([mockUser]));

    service.checkDetails().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3500/users/checkUserDetails/');
    expect(req.request.method).toEqual('GET');
    req.flush({ info: mockUser });
  });

  it('should delete user by ID', () => {
    const userID = '18b68e48-9d87-4c0c-abe0-5f3c069a1a3a';

    service.deleteUser(userID).subscribe(() => {
      
    });

    const req = httpMock.expectOne(`http://localhost:3500/users/delete/${userID}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({"message": "User deleted successfully"});
  });

  it('should initialize password reset', () => {
    const mockUser : any= {
    email: "joshuaomondi3334@gmail.com" 
    }
    service.initializePasswordReset(mockUser);

    const req = httpMock.expectOne('http://localhost:3500/users/initiate-password-reset/');
    expect(req.request.method).toEqual('POST');
    req.flush({"message": "Password initialized successfully"});
  });

 
  it('should reset password', () => {
    const mockUser: any ={
  email: "isaackilimok2@gmail.com",
  resetToken:"d299ae10-9188-4a2c-a145-b06562e454d9",
  newPassword:"12345678@ik" 
}
    service.resetPassword(mockUser);

    const req = httpMock.expectOne('http://localhost:3500/users/reset-password/');
    expect(req.request.method).toEqual('POST');
    req.flush({"message": "password reset successfull"});
  });

});


