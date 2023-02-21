const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/smartatt-clock/manage/hasBeenUsed',
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
                    if (resData.success == true && resData.data) {
                        resolve(resData.data)
                    } else {
                        reject(`是否使用新考勤和旧版调休假计算方案查询：${JSON.stringify(resData)}`)
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