

class ErrorWithCode extends Error {
    constructor(
        public readonly code:string,
        message?:string,
    ){
        super(message);
    }
}

export const UserNotFoundError=new ErrorWithCode("USER_NOT_FOUND");
export const UserAlreadyExistError=new ErrorWithCode("USER_ALREADY_EXISTS");
export const NotAdminError=new ErrorWithCode("NOT_ADMIN_USER");
export const AuthenticationError=new ErrorWithCode("USER_NOT_AUTHENTICATED");
