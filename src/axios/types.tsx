import AxiosInterceptorManager from './axiosinterceptor'
import {CancelToken} from './cancel'
export type Methods =  'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'link' | 'LINK'
| 'unlink' | 'UNLINK'

//定义传入接口 
export interface AxiosRequestConfig{
    url?:string
    method?:Methods
    params?:any,
    data?:Record<string,any>,
    headers?:Record<string,any>,
    timeout?:number,
    transformRequest?:(data:any,headers:any)=>any,
    transformResponse?:(data:any)=>any,
    cancelToken?:any;
   
}

//定义实例
export interface AxiosInstance{
    <T=any>(config:AxiosRequestConfig):Promise<AxiosResponse<T>>
    interceptors:{
        request:AxiosInterceptorManager<AxiosRequestConfig>
        response:AxiosInterceptorManager<AxiosResponse >
    },
    defaults:Required<AxiosRequestConfig>,
    isCancel: (err:any)=>boolean,
    CancelToken:CancelToken
}

//定义返回接口
export interface AxiosResponse<T=any>  {
    data: T;
    status: number;
    statusText: string;
    headers?: Record<string,any>;
    config?: AxiosRequestConfig;
    request?: XMLHttpRequest;
}


