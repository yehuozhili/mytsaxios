import Axios from './axios'
import {AxiosInstance}from './types'

function creatInstance<T>():AxiosInstance{
    let context:Axios<T> = new Axios();
    //相当于执行instance就执行Axios原型上request方法，指针是Axios实例
    let instance = Axios.prototype.request.bind(context)
    //把实例，原型，方法合并，可以拿到所有身上的方法
    instance =Object.assign(instance,Axios.prototype,context)
    return instance as AxiosInstance
}

let axios:AxiosInstance = creatInstance()
export default axios
export * from './types'