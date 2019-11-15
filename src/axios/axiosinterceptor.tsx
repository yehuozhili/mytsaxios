interface OnFulfilled<T>{
    (value:T):T|Promise<T>
}
interface OnRejected{
    (err:any):any
}
export interface Interceptor<T>{
    onFulfilled?:OnFulfilled<T>
    onRejected?:OnRejected
}
export default class  AxiosInterceptorManager<T>{
      interceptors:Array<Interceptor<T>|null>=[]
      use(onFulfilled:OnFulfilled<T>,onRejected?:OnRejected):number{
        this.interceptors.push({
            onFulfilled,
            onRejected
        })
        return this.interceptors.length-1
      }
      eject(id:number){
          if(this.interceptors[id]){
              this.interceptors[id]=null
          }
      }

}