const http          = require('http')
const querystring   = require('querystring')
const config        = require('../config/index')


module.exports = function (eid) {
    return new Promise ((resolve, reject) => {
        let httpReq = http.get(`http://${config.txCloudHost}/smartatt-trans/customer/find?eid=${eid}`, httpRes => {
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
                        if (data && data.eid) {
                            resolve(data.status)
                        } else {
                            resolve(0)
                        }
                    } else {
                        reject(`是否迁移状态查询：JSON.stringify(resData)`)
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        httpReq.on('error', (e) => {
            reject(e);
        });
    })
}