/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-06 10:22:00
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\request\http.js
 * 
 */
import service from '~/request/request.js'

export function GET(config) {
    const { url = '', data = {}, ...opt } = config
    return service
        .get(url, {
            params: data,
            ...opt
        })
        .then(res => {
            // eslint-disable-next-line no-console
            // console.log('res:',res);
            return [null, res]
        })
        .catch(err => {

            return [err, null]
        })
}
export function POST(config) {
    const { url = '', data = {}, ...opt } = config
    return service
        .post(url, data, opt)
        .then(res => {
            return [null, res]
        })
        .catch(err => {
            return [err, null]
        })
}

export function PUT(config) {
    const { url = '', data = {}, ...opt } = config
    return service
    .put(url, data, opt)
    .then(res => {
        return [null, res]
    })
    .catch(err => {
        return [err, null]
    })
}

export function UPLOAD(config) {
    const { url = '', data = {}, ...opt } = config
    return service
        .post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            ...opt
        })
        .then(res => {
            return [null, res]
        })
        .catch(err => {
            return [err, null]
        })
}
