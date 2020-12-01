const app = require('../app');
const port = process.env.PORT || 4000;
const { cachingServersToRedis, initEveryContainersAfterUse } = require('../ssh/tools');
const schedule = require('node-schedule');

const serverCaching = schedule.scheduleJob('*/15 * * * * *', cachingServersToRedis);

// Initialize every instances after end-day at 00:00:01 everyday
// but if (end-day + 1) user = (end-day) user, don't do.
const serverInitAfterUse = schedule.scheduleJob('1 0 0 * * *', initEveryContainersAfterUse);

app.listen(port, () => {
    console.log(`running server port ${port}`);
});
