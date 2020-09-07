export class UserError extends Error {
    constructor(public code: string) {
        super();
    }
}
