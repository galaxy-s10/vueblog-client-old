import axios from 'axios'
import { MessageBox, Message } from 'element-ui'

const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// 响应拦截
service.interceptors.response.use(
    // 响应成功
    response => {
        const res = response.data
        // if (res.code !== 20000) {
        //     Message({
        //         message: res.message || 'Error',
        //         type: 'error',
        //         duration: 5 * 1000
        //     })
        // }
        return res
    },
    // 响应失败
    error => {
        console.log(error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 1000
        })
        return Promise.reject(error)
    }
)

// 导出封装好的axios实例
export default service
