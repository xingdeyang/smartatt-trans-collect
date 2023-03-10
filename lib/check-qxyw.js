const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/cloudauth/authapi/checkSynsDataLogByEid',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                cookie: config.cookie
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
                        resolve((result && result.ref) ? 1 : 0)
                    } else {
                        reject(`权限业务中心开启查询：${JSON.stringify(resData)}`);
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