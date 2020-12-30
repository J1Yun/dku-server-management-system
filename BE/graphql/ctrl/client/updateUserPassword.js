const models = require('../../../models');
const { createHashedPassword, makePasswordHashed } = require('../../../controllers/user/user.ctrl');
module.exports = async ({ currentPassword, newPassword }, { userId }) => {
    const currentHashedPassword = await makePasswordHashed(userId, currentPassword);
    if (currentHashedPassword instanceof Error) {
        return false;
    }
    const isValidUser = await models.user
        .findOne({
            attributes: ['id', 'userId'],
            where: { userId, password: currentHashedPassword },
            raw: true,
        })
        .then((user) => (user ? true : false))
        .catch(() => false);

    if (isValidUser) {
        const { password, salt } = await createHashedPassword(newPassword);
        return await models.user
            .update({ password, salt }, { where: { userId } })
            .then(() => true)
            .catch(() => false);
    } else {
        return false;
    }
};
