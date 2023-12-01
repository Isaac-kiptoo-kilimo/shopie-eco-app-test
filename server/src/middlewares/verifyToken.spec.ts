import { Request} from "express";
import { Jwt } from "jsonwebtoken";
import { verifyToken } from "./verifyToken";

let mockRequest=()=>{
    return{
        headers:{
            token:'Valid_token_mocked_for_testing_kskdlsdlllllsm'
        }
    }
}

let mockResponse=()=>{
    return{
        status:jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

let mockNext=jest.fn()

describe("Testing the middlewares",()=>{
    it("Throws an error if token is missing",()=>{
        let req={
            headers:{}
        }
        let res=mockResponse()

        let next=mockNext()

        verifyToken(req as any,res as any ,next)
        expect(res.json).toHaveBeenCalledWith({message:"You do not have access"})
    })

    it("authorizes the user",()=>{
        
    })
})
