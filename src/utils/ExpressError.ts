export class ExpressError extends Error{
    statusCode: any;
    constructor(message:any, statusCode:any){
        console.log("KE SNI")
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}