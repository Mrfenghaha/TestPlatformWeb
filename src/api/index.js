import axios from 'axios'

// 允许跨域携带cookie
axios.defaults.withCredentials = true;

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
