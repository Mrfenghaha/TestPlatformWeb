import axios from 'axios'

// 允许跨域携带cookie
axios.defaults.withCredentials = true;


// 测试工具-正交法
export const toolPairs = (input) => {
  return axios.request({
      method: 'POST',
      url: '/tool/pairs',
      data: {"input": input}
  })
}