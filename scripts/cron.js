const schedule = require('node-schedule');
const { emailDigest } = require('./email-digest');
module.exports = function () {
    schedule.scheduleJob({
        rule: '59 23 * * *' // 11:59 PM everyday
    }, function () { emailDigest() })

}
// console.log("Email digest")
// emailDigest()