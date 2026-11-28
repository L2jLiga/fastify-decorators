import {app} from "../../src/index.js";
import UsersService from "../../src/Components/Users/Users.service.js";
import {NotAdminError,UserNotFoundError,AuthenticationError} from "../../src/Errors";


describe("Protected Controller",()=>{

    const baseRoute="/protected";
    const user="SomeUser",admin="admin";

    beforeEach(()=>{
        UsersService.users.clear();
    });

    const authenticatedRoute="/authenticated";
    describe(`${authenticatedRoute} Endpoint`,()=>{

        const endpointUrl=baseRoute+authenticatedRoute;

        it("should grant authenticated requests",async ()=>{
            UsersService.users.add(user);
            const response=await app.inject({
                url:endpointUrl,
                cookies:{username:user},
            });
            const body=response.json();
            expect(body).toEqual({ok:true});
        });

        it("should reject unanthenticated requests",async ()=>{
            const response=await app.inject(endpointUrl);
            const body=response.json();
            expect(body.code).toEqual(AuthenticationError.code);
        });
    });

    const adminRoute="/admin";
    describe(`${adminRoute} Endpoint`,()=>{

        const endpointUrl=baseRoute+adminRoute;

        it("should grant authenticated admins",async ()=>{
            UsersService.users.add(admin);
            const response=await app.inject({
                url:endpointUrl,
                method:"POST",
                cookies:{username:admin},
            });
            expect(response.statusCode).toEqual(200);
            const body=response.json();
            expect(body).toEqual({ok:true});
        });

        it("should reject authenticated non-admins",async ()=>{
            UsersService.users.add(user);
            const response=await app.inject({
                url:endpointUrl,
                method:"POST",
                cookies:{username:user},
            });
            expect(response.statusCode).toEqual(500);
            const body=response.json();
            expect(body.code).toEqual(NotAdminError.code);
        });

        it("should reject unknown admins",async ()=>{
            const response=await app.inject({
                url:endpointUrl,
                method:"POST",
                cookies:{username:admin},
            });
            expect(response.statusCode).toEqual(500);
            const body=response.json();
            expect(body.code).toEqual(UserNotFoundError.code);
        });

        it("should reject unanthenticated requests",async ()=>{
            const response=await app.inject({
                url:endpointUrl,
                method:"POST",
            });
            expect(response.statusCode).toEqual(500);
            const body=response.json();
            expect(body.code).toEqual(AuthenticationError.code);
        });
    });
});

