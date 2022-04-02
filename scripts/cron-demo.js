const schedule = require('node-schedule');
const { demoDigest } = require('./demo-digest');
module.exports = function () {
    schedule.scheduleJob({
        rule: '59 23 * * *' // 11:59 PM everyday
    }, function () { demoDigest() })

}
console.log("Demo digest")
// demoDigest()