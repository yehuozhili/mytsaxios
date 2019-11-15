import {AxiosRequestConfig,AxiosResponse} from './types'
import qs from 'qs'
import parseHeaders from 'parse-headers'
import AxiosInterceptorManager ,{Interceptor} from './axiosinterceptor';
import {CancelToken,Cancel} from './cancel'
let defaults :AxiosRequestConfig={
    method:'get',
    timeout:0,
    headers:{
        common:{
            'Accept':'application/json',
            'name':'sdsad'
        }
    },
  
}
let getStyleMethod =['get','head','delete','option']
let postStyleMethod=['put','post','patch']
getStyleMethod.forEach((method)=>{
    defaults.headers![method]={}
})
postStyleMethod.forEach((method)=>{
    defaults.headers![method]={
        'Content-Type':'application/json',
    }
})
let allMethod = [...getStyleMethod,...postStyleMethod]
export default class Axios<T>{
    CancelToken:CancelToken=new CancelToken()
    isCancel= (err:any)=>{
        return err instanceof Cancel
    }
    defaults:AxiosRequestConfig =defaults
    interceptors = {
        request:new AxiosInterceptorManager<AxiosRequestConfig>(),
        response:new AxiosInterceptorManager<AxiosResponse<T>>()
    }
    request(config:AxiosRequestConfig):Promise<AxiosResponse<T>|AxiosRequestConfig>{
        config.headers=Object.assign(this.defaults.headers,config.headers)
       
        if(config.transformRequest&&config.data){      
            config.data=config.transformRequest(config.data,config.headers)    
        }

        let chain :any[]=[
            {
                onFulfilled:this.dispatchRequest,
                onRejected:(err:any)=>err
            }
        ]
        this.interceptors.request.interceptors.forEach((interceptor:Interceptor<AxiosRequestConfig>|null)=>{
            interceptor&&chain.unshift(interceptor)
        })
        this.interceptors.response.interceptors.forEach((interceptor:Interceptor<AxiosResponse<T>>|null)=>{
            interceptor&&chain.push(interceptor)
        })
        let promise:Promise<AxiosRequestConfig|AxiosResponse<T>>=Promise.resolve(config)
        while(chain.length){
            const {onFulfilled,onRejected}=chain.shift()
            promise = promise.then(onFulfilled,onRejected)
        }
        return promise
    }
    dispatchRequest(config:AxiosRequestConfig):Promise<AxiosResponse<T>>{
        return new Promise<AxiosResponse<T>>((resolve,reject)=>{
            let {method,url,params,headers,data,timeout} = config
            let request = new XMLHttpRequest();
            let tmp:string|undefined;
            if(params&&typeof params==='object'){
                tmp = qs.stringify(params)
            }
            if(!url)url=''
            url += (url.includes('?')?'&':'?'+(tmp?tmp:''))
            if(!method)method='GET'
            request.open(method,url,true)
            request.responseType='json'
            request.onreadystatechange=function(){
                //4完成
                if(request.readyState===4&&request.status!==0){
                    if(request.status>=200&&request.status<300){
                        let response:AxiosResponse<T>={
                            data:request.response?request.response:request.responseText,
                            status:request.status,
                            statusText:request.statusText,
                            //响应头xxx=xxx转换成对象格式
                            headers:parseHeaders(request.getAllResponseHeaders()),
                            config,
                            request
                        }
                        if(config.transformResponse){
                            response=config.transformResponse(response)
                        }
                        resolve(response)
                    }else{
                        reject(`超时错误码${request.status}`)
                    }
                }
            }
            if(headers){
                for(let key in headers){
                    if(key==='common'||allMethod.includes(key)){//排除自定方法
                        if(key==='common'||key===config.method){//本次发送方法
                            for(let key2 in headers[key]){
                                request.setRequestHeader(key2,headers[key][key2])
                            }
                        }         
                    }else{
                        request.setRequestHeader(key,headers[key])//正常请求头
                    }
                }
            }
            let body:string|null = null
            if(data){
                body=JSON.stringify(data)
            }
            request.onerror=function(){
                reject("网络不通") 
            }
            if(timeout){
                request.timeout=timeout
                request.ontimeout=function(){
                    reject(`超过已配置时间${timeout}ms`)
                }
            }
            if(config.cancelToken){
                config.cancelToken.then((message:string)=>{
                    request.abort()
                    reject(message)
                })
            }
            request.send(body)
        })
    }
}