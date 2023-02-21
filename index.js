/*
    汇总结果字段顺序
    1. eid
    2. 考勤付费（1：付费 0：非付费）
    3. 签到活跃（1：活跃 0：非活跃）
    4. 审批付费（1：付费 0：非付费）
    5. 权限业务中心（1：开启 0：未开启）
    6. 启用新考勤（1：启用 0：未启用）
    7. 调休假方案大于1（1：大于一 0：小于等于一）
    8. 考勤机使用（1：使用 2：未使用）
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
const getQxywInfo       = require('./lib/check-qxyw')
const getUseNew         = require('./lib/check-useNew')
const getUseMachine     = require('./lib/check-useMachine')
const getTransStatus    = require('./lib/check-transStatus')
const getNetworkInfo    = require('./lib/check-networkInfo')

async function init () {
    const rl = readline.createInterface({
        input: fs.createReadStream(path.resolve(__dirname, './eid.txt')),
        outpu: process.stdout
    })
    for await (const eid of rl) {
        console.log('当前处理eid: %s', eid)
        try {
            const c1 = eid
            const c2 = await getQdFfInfo(eid)
            const c3 = await getQdHuoYue(eid)
            const c4 = await getSpFfInfo(eid)
            const c5 = await getQxywInfo(eid)
            let {hasUse, hasMultiRules} = await getUseNew(eid)
            const c6 = hasUse ? 1 : 0
            const c7 = hasMultiRules ? 1: 0
            const c8 = await getUseMachine(eid)
            const c9 = await getTransStatus(eid)
            let {networkId: c10, name: c11} = await getNetworkInfo(eid)
        } catch (err) {
            console.log('%s, 提取信息过程出现异常: %s', eid, err)
        }
    }
}
init()