export class InvalidCredentials extends Error {
    statusCode: number;
    constructor(message: string = "Invalid credentials", statusCode:number = 500) {
        super(message);
        this.statusCode = statusCode;
    }
} 