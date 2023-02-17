const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')
const serviceId     = 'S100048'


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
                        let isSpFf = 0
                        if (result.state == 1 && result.endDate && (Date.parse(new Date()) <= Date.parse(new Date(result.endDate)))) {
                            isSpFf = 1
                        }
                        resolve(isSpFf)
                    } else {
                        reject(`审批付费查询：${JSON.stringify(resData)}`);
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