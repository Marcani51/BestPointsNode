export class ExpressError extends Error{
    statusCode: any;
    constructor(message:any, statusCode:any){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}