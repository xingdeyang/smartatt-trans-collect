const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/smartatt-clock/manage/opendog/attDev/countZHGS',
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
                        resolve((result > 0) ? 1 : 0)
                    } else {
                        reject(`使用综合工时签到组查询：${JSON.stringify(resData)}`);
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
            eid
        }));
    })
}