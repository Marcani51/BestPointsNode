
export class ExpressError extends Error{
    constructor(message:any, statusCode:any){
        super()
        this.message= message
        //@ts-ignore
        this.statusCode= statusCode
    }
}
