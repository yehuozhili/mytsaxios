import axios,{AxiosResponse,AxiosRequestConfig} from './axios';
const baseURL = "http://localhost:8080";
interface User{
    name:string
    password: string
}
let user : User ={
    name:'yehuo',
    password:'123456'
}
// let request = axios.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig=>{
//     config.headers!.name+='1'
//     return config
// })
// axios.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig=>{
//     config.headers!.name+='2'
//     return config
// })
// axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
//     response.data.name+='3'
//     return response
// })
// let response = axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
//     response.data.name+='4'
//     return response
// })
// axios.interceptors.request.eject(request)
// axios.interceptors.response.eject(response)
const CanceToken = axios.CancelToken
const source =CanceToken.source()
const isCancel = axios.isCancel


axios({
    method:'post',
    url:baseURL+'/post',
    data:user,
    headers:{
        // 'Content-Type':'application/json',
        // 'name':'bbbb'
    },
    timeout:1000,
    cancelToken:source.token
    // transformRequest:(data,head)=>{     
    //     head['common']['name']='kcvxcvc'
    //     return data
    // },
    // transformResponse:(response)=>{
    //     console.log(response);      
    //     return response.data
    // }
}).then((response:AxiosResponse<User>)=>{
    console.log(response);
    return response.data
}).catch(err=>{
    if(isCancel(err)){
        console.log(err,'iscancel')
    }
})

// source.cancel('用户取消')
