import mssql from 'mssql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v4} from 'uuid'
import { Request, Response } from 'express'
import { deleteUserController, fetchAllUsersControllers, getSingleUserController, loginUserControllers, registerUserControllers, updateUserControllers } from './usersControllers'
import { validateUpdateuser } from '../validators/validators'

describe ("User Registration", ()=>{
 
    let res:any;

    beforeEach(()=>{
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    })

    it("successfully registers a user", async()=>{
        const req = {
            body: {
                fullName: "Mildred Ochieng",
                email: "mildred2@gmail.com",
                password: "12345678@Mo",
                profileImage:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
        }

       
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("12345678@Mo" as never)

        const mockedInput = jest.fn().mockReturnThis() 

        const mockedExecute = jest.fn().mockResolvedValue({rowsAffected: [1]})

        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute
        }

        const mockedPool = { 
            request: jest.fn().mockReturnValue(mockedRequest)
        }

      

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never)

        await registerUserControllers(req as Request, res as any)

        // Assertions
     
        expect(res.json).toHaveBeenCalledWith({message: 'User Registered Successfully'})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(mockedInput).toHaveBeenCalledWith('password',  mssql.VarChar, '12345678@Mo')
        expect(mockedInput).toHaveBeenCalledWith('fullName',  mssql.VarChar, 'Mildred Ochieng')
        expect(mockedInput).toHaveBeenCalledWith('email',  mssql.VarChar, 'mildred2@gmail.com')
        expect(mockedInput).toHaveBeenCalledWith('profileImage',  mssql.VarChar, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
    })

})


/**
 * 
 * TESTING LOGIN FUNCTIONALITY
 * 
 */

describe ("Testing Login Functionality", ()=>{

    let res:any

    beforeEach(()=>{
        res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    it('Returns an error if email or password is empty' ,async()=>{
        const req = {
            body:{
                email: "",
                password: ""
            }
        }

        await loginUserControllers(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({"error": "\"email\" is not allowed to be empty"})

    })

    it('Returns an error if email or password is missing' ,async()=>{
        const req = {
            body:{
                
            }
        }

        await loginUserControllers(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({"error": "\"email\" is required"})

    })

    it("Returns an error if email is not in database", async()=>{
        const req = {
            body:{
                email: "emmanuelm1anu@gmail.com",
                password: "12345678@Em"
            }
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: []})
        } as never)

        await loginUserControllers(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({error: "Email not found"}) 
    })

    it("Handles incorrect password scenario", async()=>{
        const req = {
            body:{
                email: "mildred2@gmail.com",
                password: "12345678@Mo"
            }
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [{
                    email: 'mildred2@gmail.com',
                    password: 'hashedPwd'
                }]
            })
        } as never)

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)

        await loginUserControllers(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({error: "Incorrect password"})
    })

    it("successfully logs in a user and returns a token", async()=>{

        let expectedUser = {
          userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40",
          fullName: "Mildred Ochieng",
          email: "mildred2@gmail.com",
          password: "$2b$05$yjF7t5M8hOAfJv8JePjBOuAQs5XTMin/6MbxYEFKOOjAOEq0Z6CWy",
          role: "customer",
          resetToken: null,
          expiryTime: null,
          welcomed: false,
          isSend: false,
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }

        const req = {
            body:{
                email: expectedUser.email,
                password: "12345678@Mo"
            }
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: [expectedUser]})
        } as never)

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never)

        jest.spyOn(jwt, 'sign').mockReturnValueOnce("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJiZDg2YzZiMS1iYmUxLTQ2OWItOGU4NS0wMDVjOTBjOWJiNDAiLCJmdWxsTmFtZSI6Ik1pbGRyZWQgT2NoaWVuZyIsImVtYWlsIjoibWlsZHJlZDJAZ21haWwuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwicmVzZXRUb2tlbiI6bnVsbCwiZXhwaXJ5VGltZSI6bnVsbCwid2VsY29tZWQiOmZhbHNlLCJpc1NlbmQiOmZhbHNlLCJwcm9maWxlSW1hZ2UiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzAwMzIxMTE2OS0wYTFkZDcyMjhmMmQ_cT04MCZ3PTEzNzQmYXV0bz1mb3JtYXQmZml0PWNyb3AmaXhsaWI9cmItNC4wLjMmaXhpZD1NM3d4TWpBM2ZEQjhNSHh3YUc5MGJ5MXdZV2RsZkh4OGZHVnVmREI4Zkh4OGZBJTNEJTNEIiwiaWF0IjoxNzAxMzQyOTk1LCJleHAiOjE3MDE1MTU3OTV9.ZXdADA07gCuZKejS2shDcz0Adzx7qrJT1bSjAznTrEU" as never)

        await loginUserControllers(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({
            message: "Logged in successfully",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJiZDg2YzZiMS1iYmUxLTQ2OWItOGU4NS0wMDVjOTBjOWJiNDAiLCJmdWxsTmFtZSI6Ik1pbGRyZWQgT2NoaWVuZyIsImVtYWlsIjoibWlsZHJlZDJAZ21haWwuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwicmVzZXRUb2tlbiI6bnVsbCwiZXhwaXJ5VGltZSI6bnVsbCwid2VsY29tZWQiOmZhbHNlLCJpc1NlbmQiOmZhbHNlLCJwcm9maWxlSW1hZ2UiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzAwMzIxMTE2OS0wYTFkZDcyMjhmMmQ_cT04MCZ3PTEzNzQmYXV0bz1mb3JtYXQmZml0PWNyb3AmaXhsaWI9cmItNC4wLjMmaXhpZD1NM3d4TWpBM2ZEQjhNSHh3YUc5MGJ5MXdZV2RsZkh4OGZHVnVmREI4Zkh4OGZBJTNEJTNEIiwiaWF0IjoxNzAxMzQyOTk1LCJleHAiOjE3MDE1MTU3OTV9.ZXdADA07gCuZKejS2shDcz0Adzx7qrJT1bSjAznTrEU"
        }) 
    }) 

    })



    describe("User Update and Details", () => {
        let res: any;
      
        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
          };
        });
      
        it("Updates user details", async () => {
          const req = {
            params: {
              userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40"
            },
            body: {
              fullName: "Mildred Ochieng",
              email: "mildred2p@gmail.com",
              profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          };
      
        
          const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
      
          const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
          };
      
          const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
          };
      
          jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);
      
          await updateUserControllers(req as any, res as any);
      
          expect(res.json).toHaveBeenCalledWith({ message: "User updated successfully" });
        });

        
      
        it("Gets all users", async () => {
          const req = {};
      
          const mockedUsers = [
            {
              userID: "a20f48e3-b8c1-4446-827d-d16e2e317971",
              fullName: "joshua omondi",
              email: "joshuaomondi3334@gmail.com",
              password: "$2b$05$Iz49oOkLiS8hLOnDC8VpCOyk8yFu2BYxYXhVDTGUjq4PLlC4.v.FC",
              role: "customer",
              resetToken: null,
              expiryTime: null,
              welcomed: true,
              isSend: false,
              profileImage: "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png"
            },
            {
              userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40",
              fullName: "Mildred Ochieng",
              email: "mildred2@gmail.com",
              password: "$2b$05$yjF7t5M8hOAfJv8JePjBOuAQs5XTMin/6MbxYEFKOOjAOEq0Z6CWy",
              role: "customer",
              resetToken: null,
              expiryTime: null,
              welcomed: false,
              isSend: false,
              profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
          ];
      
          jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({ recordset: mockedUsers })
          } as never);
      
          await fetchAllUsersControllers(req as any, res as any);
      
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith(mockedUsers);
        });

      
        it("Gets single user", async () => {
          const req = {
            params: {
              userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40"
            }
          };

          const mockedOneUser={
                userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40",
                fullName: "Mildred Ochieng",
                email: "midred2@gmail.com",
                role: "customer"
              }
          
      
          jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({ recordset: [mockedOneUser]})
          } as never);
      
          await getSingleUserController(req as any, res as any);
      
          expect(res.json).toHaveBeenCalledWith([mockedOneUser]);
        });



      
        it("Deletes user", async () => {
          const req = {
            params: {
              userID: "bd86c6b1-bbe1-469b-8e85-005c90c9bb40"
            }
          };
      
          const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
      
          const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute: mockedExecute
          };
      
          const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
          };
      
          jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);
      
          await deleteUserController(req as any, res as any);
      
          expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    })




    