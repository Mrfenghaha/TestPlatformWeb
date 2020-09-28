import axios from 'axios'

// 允许跨域携带cookie
axios.defaults.withCredentials = true;


// mockServer-mock配置
export const toolMockServerGetMockList = (size, page) => {
    return axios.request({
        method: 'GET',
        url: '/tool/mock_server/get_mock_list',
        params: {
          "page": page,
          "size": size
        }
    })
}

export const toolMockServerGetMock = (id) => {
  return axios.request({
      method: 'GET',
      url: '/tool/mock_server/get_mock',
      params: {"id": id}
  })
}

export const toolMockServerAddMock = (url, methods, is_available, delay, remark) => {
    return axios.request({
        method: 'POST',
        url: '/tool/mock_server/add_mock',
        data: {
            "url": url,
            "methods": methods,
            "is_available": is_available,
            "delay": delay,
            "remark": remark
        }
    })
}

export const toolMockServerUpdateMock= (id, url, methods, is_available, delay, default_resp_id, remark) => {
    return axios.request({
        method: 'PUT',
        url: '/tool/mock_server/update_mock',
        data: {
            "id": id,
            "url": url,
            "methods": methods,
            "is_available": is_available,
            "delay": delay,
            "default_resp_id": default_resp_id,
            "remark": remark
        }
    })
}

export const toolMockServerDelMock = (id) => {
    return axios.request({
        method: 'DELETE',
        url: '/tool/mock_server/delete_mock',
        data: {"id": id}
    })
}

// mockServer-mock参数获取
export const toolMockServerGetConfigs = () => {
  return axios.request({
      method: 'GET',
      url: '/tool/mock_server/get_configs',
      params: {}
  })
}

// mockServer-mock下的response
export const toolMockServerGetRespList = (mock_id) => {
  return axios.request({
      method: 'GET',
      url: '/tool/mock_server/get_response_list',
      params: {"mock_id": mock_id}
  })
}

export const toolMockServerAddResp = (mock_id, name, status, headers, body, remark) => {
  return axios.request({
      method: 'POST',
      url: '/tool/mock_server/add_response',
      data: {
          "mock_id": mock_id,
          "name": name,
          "status": status,
          "headers": headers,
          "body": body,
          "remark": remark
      }
  })
}

export const toolMockServerUpdateResp= (id, mock_id, name, status, headers, body, remark) => {
  return axios.request({
      method: 'PUT',
      url: '/tool/mock_server/update_response',
      data: {
          "id": id,
          "mock_id": mock_id,
          "name": name,
          "status": status,
          "headers": headers,
          "body": body,
          "remark": remark
      }
  })
}

export const toolMockServerDelResp = (mock_id, id) => {
  return axios.request({
      method: 'DELETE',
      url: '/tool/mock_server/delete_response',
      data: {
        "mock_id": mock_id,
        "id": id
      }
  })
}