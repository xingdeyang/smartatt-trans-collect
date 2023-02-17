/*
    汇总结果字段顺序
    1. eid
    2. 考勤付费（1：付费 0：非付费）
    3. 签到活跃（1：活跃 0：非活跃）
    4. 审批付费（1：付费 0：非付费）
    5. 权限业务中心（1：开启 0：未开启）
    6. 启用新考勤（1：启用 0：未启用）
    7. 调休假方案（1：等于一 0：大于一）
    8. 考勤机同步（1：使用 2：未使用）
    9. 迁移状态（1：已迁移 2：不迁移 0：未迁移）
    10. networkId
    11. 工作圈名称
*/
const fs                = require('fs')
const path              = require('path')
const readline          = require('readline')
const getQdFfInfo       = require('./lib/check-qdff')
const getQdHuoYue       = require('./lib/check-qdhy')
const getSpFfInfo       = require('./lib/check-spff')

async function init () {
    const rl = readline.createInterface({
        input: fs.createReadStream(path.resolve(__dirname, './eid.txt')),
        outpu: process.stdout
    })
    for await (const eid of rl) {
        console.log('当前处理eid: %s', eid)
        try {
            const c2 = await getQdFfInfo(eid)
            const c3 = await getQdHuoYue(eid)
            const c4 = await getSpFfInfo(eid)
            console.log(c3)
        } catch (err) {
            console.log('%s, 提取信息出现异常: %s', eid, err)
        }
    }
}
init()