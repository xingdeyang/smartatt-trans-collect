const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')
const serviceId     = 'S100047'


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/scc/service/getCtrlInfo',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
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
                        let result = resData.data
                        let isQdFf = 0
                        if (result.state == 1 && result.endDate && (Date.parse(new Date()) <= Date.parse(new Date(result.endDate)))) {
                            isQdFf = 1
                        }
                        resolve(isQdFf)
                    } else {
                        reject(`签到付费查询：${JSON.stringify(resData)}`);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        httpReq.on('error', (e) => {
            reject(e);
        });
        httpReq.end(querystring.stringify({
            eid,
            serviceId
        }));
    })
}