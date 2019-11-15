export class Cancel{
    message:string;
    constructor(message:string){
        this.message=message
    }
}

export class CancelToken{
    resolve:any;
    source(){
        return{
            token:new Promise((resolve)=>{
                this.resolve=resolve
            }),
            cancel:(message:string)=>{
                this.resolve(new Cancel(message))
            },
        }
    }
}