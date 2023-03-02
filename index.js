/*
    一、nodejs版本：14.17.0
    二、运行依赖smartatt-clock登录态cookie与token(配置在config中)
    二、汇总结果字段顺序
        1. eid
        2. 签到付费（1：付费 0：非付费）
        3. 签到活跃（1：活跃 0：非活跃）
        4. 审批付费（1：付费 0：非付费）
        5. 权限业务中心开启（1：开启 0：未开启）
        6. 使用过新考勤（1：启用 0：未启用）
        7. 有多条调休假计算方案（1: 是 0：否）
        8. 使用综合工时制签到组（1：是 0：否）
        9. 使用考勤机（1：使用 2：未使用）
        10. 迁移状态（1：已迁移 2：不迁移 0：未迁移）
        11. networkId
        12. 工作圈名称
*/

const fs                        = require('fs')
const { rm, open, writeFile }   = require('fs').promises
const path                      = require('path')
const readline                  = require('readline')
const getQdFfInfo               = require('./lib/check-qdff')
const getQdHuoYue               = require('./lib/check-qdhy')
const getSpFfInfo               = require('./lib/check-spff')
const getQxywInfo               = require('./lib/check-qxyw')
const getUseNew                 = require('./lib/check-useNew')
const getUseZhgs                = require('./lib/check-useZhgs')
const getUseMachine             = require('./lib/check-useMachine')
const getTransStatus            = require('./lib/check-transStatus')
const getNetworkInfo            = require('./lib/check-networkInfo')
const resultTitle               = `eid\t签到付费\t签到活跃\t审批付费\t权限业务中心开启\t使用过新考勤\t有多条调休假计算方案\t使用考勤机\t迁移状态\tnetworkId\t工作圈名称\n`

async function init () {
    const resultFilePath = path.resolve(__dirname, './result.txt')
    await rm(resultFilePath)
    const fd = await open(resultFilePath, 'a')
    await writeFile(fd, resultTitle)
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
            let { hasUse, hasMultiRules } = await getUseNew(eid)
            const c6 = hasUse ? 1 : 0
            const c7 = hasMultiRules ? 1: 0
            const c8 = await getUseZhgs(eid)
            const c9 = await getUseMachine(eid)
            const c10 = await getTransStatus(eid)
            let { networkId: c11, name: c12 } = await getNetworkInfo(eid)
            const lineData = `${c1}\t${c2}\t${c3}\t${c4}\t${c5}\t${c6}\t${c7}\t${c8}\t${c9}\t${c10}\t${c11}\t${c12}\n`
            await writeFile(fd, lineData)
        } catch (err) {
            console.log('%s, 提取信息过程出现异常: %s', eid, err)
        }
    }
}
init()