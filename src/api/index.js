import axios from 'axios'

// 允许跨域携带cookie
axios.defaults.withCredentials = true;

// mockServer-mockr
export const toolMockServerGetMockList = (size, page) => {
    return axios.request({
        method: 'GET',
        url: `/tool/mock_server/get_mock_list?page=${page}&size=${size}`,
    })
}

// export const toolDBOperAddConfig = (name, ip, port, username, password, remark) => {
//     return axios.request({
//         method: 'POST',
//         url: '/tool/db_operation/add_config',
//         data: {
//             "name": name,
//             "ip": ip,
//             "port": port,
//             "username": username,
//             "password": password,
//             "remark": remark
//         }
//     })
// }

// export const toolDBOperUpdateConfig = (id, name, ip, port, username, password, remark) => {
//     return axios.request({
//         method: 'PUT',
//         url: '/tool/db_operation/update_config',
//         data: {
//             "id": id,
//             "name": name,
//             "ip": ip,
//             "port": port,
//             "username": username,
//             "password": password,
//             "remark": remark
//         }
//     })
// }

export const toolMockServerDelMock = (id) => {
    return axios.request({
        method: 'DELETE',
        url: '/tool/mock_server/delete_mock',
        data: {"id": id}
    })
}

// 测试工具-数据库操作-操作配置
export const toolDBOperGetOperList = (size, page) => {
    return axios.request({
        method: 'GET',
        url: `/tool/db_operation/get_operation_list?page=${page}&size=${size}`,
    })
}

export const toolDBOperAddOper = (name, sql, remark) => {
    return axios.request({
        method: 'POST',
        url: '/tool/db_operation/add_operation',
        data: {
            "name": name,
            "sql": sql,
            "remark": remark
        }
    })
}

export const toolDBOperUpdateOper = (id, name, sql, remark) => {
    return axios.request({
        method: 'PUT',
        url: '/tool/db_operation/update_operation',
        data: {
            "id": id,
            "name": name,
            "sql": sql,
            "remark": remark
        }
    })
}

export const toolDBOperDelOper = (id) => {
    return axios.request({
        method: 'DELETE',
        url: '/tool/db_operation/delete_operation',
        data: {"id": id}
    })
}

export const toolDBOperExOper = (db_id, operation_id, param) => {
    return axios.request({
        method: 'POST',
        url: '/tool/db_operation/execute_operation',
        data: {
            "db_id": db_id,
            "operation_id": operation_id,
            "param": param,
        }
    })
}

// 测试工具-数据库操作-数据库配置
export const toolDBOperGetConfigList = (size, page) => {
    return axios.request({
        method: 'GET',
        url: `/tool/db_operation/get_config_list?page=${page}&size=${size}`,
    })
}

export const toolDBOperAddConfig = (name, ip, port, username, password, remark) => {
    return axios.request({
        method: 'POST',
        url: '/tool/db_operation/add_config',
        data: {
            "name": name,
            "ip": ip,
            "port": port,
            "username": username,
            "password": password,
            "remark": remark
        }
    })
}

export const toolDBOperUpdateConfig = (id, name, ip, port, username, password, remark) => {
    return axios.request({
        method: 'PUT',
        url: '/tool/db_operation/update_config',
        data: {
            "id": id,
            "name": name,
            "ip": ip,
            "port": port,
            "username": username,
            "password": password,
            "remark": remark
        }
    })
}

export const toolDBOperDelConfig = (id) => {
    return axios.request({
        method: 'DELETE',
        url: '/tool/db_operation/delete_config',
        data: {"id": id}
    })
}

// 测试工具-正交法
export const toolOrthogonal = (input) => {
    return axios.request({
        method: 'POST',
        url: '/tool/pairs',
        data: {"input": input}
    })
}