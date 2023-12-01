import {v4} from 'uuid'

jest.mock('uuid',()=>({
    v4: jest.fn()
}))

describe('This mocks the uuid',()=>{
    it("Generates a unique ID",()=>{
        // const id=v4()
        const mockedV4=jest.requireMock('uuid').v4
        mockedV4.mockImplementation(()=> 'uniqueid_dfgjajkah_kdhhsf ')
        console.log(v4());
        
    })
})