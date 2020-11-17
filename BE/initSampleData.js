const models = require('./models');

const serverInit = async () => {
    await models.server.destroy({
        truncate: { cascade: true },
    });

    await models.sequelize.query('alter table servers auto_increment 1');

    return await models.server
        .bulkCreate([
            {
                name: 'SW-1서버',
                os: 'Ubuntu 18.04',
                cpu: 1,
                ram: 4,
                location: 'ICT관',
            },
            {
                name: 'SW-2서버',
                os: 'Ubuntu 18.04',
                cpu: 4,
                ram: 8,
                location: 'ICT관',
            },
            {
                name: 'SW-3서버',
                os: 'CentOS 7.5',
                cpu: 2,
                ram: 4,
                location: 'ICT관',
            },
            {
                name: 'SW-4서버',
                os: 'CentOS 7.5',
                cpu: 2,
                ram: 8,
                location: 'ICT관',
            },
            {
                name: 'SW-5서버',
                os: 'Devian 10',
                cpu: 4,
                ram: 8,
                location: 'ICT관',
            },
            {
                name: 'SW-6서버',
                os: 'Ubuntu 20.04 LTS',
                cpu: 1,
                ram: 4,
                location: 'ICT관',
            },
            {
                name: 'SW-7서버',
                os: 'Ubuntu 20.04 LTS',
                cpu: 2,
                ram: 8,
                location: 'ICT관',
            },
            {
                name: 'SW-8서버',
                os: 'Windows 2019 STD',
                cpu: 4,
                ram: 8,
                location: 'ICT관',
            },
        ])
        .then((result) => console.log(`Init sample data successfully : Server, result: ${result}`))
        .catch((err) => console.error(err));
};

serverInit();
