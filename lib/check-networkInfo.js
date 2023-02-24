const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/smartatt-clock/manage/signuser/search',
            headers: {
                'Content-Type': 'application/json',
                '__signtoken': config.token,
                'cookie': config.cookie
            },
        }, httpRes => {
            let bufferArr = []
            let size = 0
            httpRes.on('data', (chunk) => {
                bufferArr.push(chunk)
                size += chunk.length
            });
            httpRes.on('end', () => {
                try {
                    let resData = JSON.parse((Buffer.concat(bufferArr, size)).toString());
                    if (resData.success == true) {
                        let data = resData.data
                        if (data && (data.networkId || data.name)) {
                            resolve(data)
                        } else {
                            reject(`查询工作圈信息异常：JSON.stringify(resData)`)
                        }
                    } else {
                        reject(`查询工作圈信息异常：JSON.stringify(resData)`)
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        httpReq.on('error', (e) => {
            reject(e);
        });
        httpReq.end(JSON.stringify({
            eid
        }));
    })
}