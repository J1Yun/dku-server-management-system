const app = require('../app');
const port = process.env.PORT || 4000;
const { setContainerStatusToRedis, setHostStatusToRedis } = require('../ssh/tools');
const schedule = require('node-schedule');

const serverCaching = schedule.scheduleJob('*/15 * * * * *', () => {
    setHostStatusToRedis();
    setContainerStatusToRedis();
    console.log('[Scheduler] Cached server status to redis.');
});

app.listen(port, () => {
    console.log(`running server port ${port}`);
});
