const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.request({
            hostname: config.defaultHost,
            method: 'POST',
            path: '/smartatt-clock/manage/opendog/infos',
            headers: {
                'Content-Type': 'application/json'
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
                        resolve((data && Object.keys(data).length) ? 1 : 0)
                    } else {
                        reject(`是否使用考勤机查询：JSON.stringify(resData)`)
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        httpReq.on('error', (e) => {
            reject(e);
        });
        httpReq.end(JSON.stringify([eid]));
    })
}