const models = require('../../../models');
const { sendMailOfReservationApplyOk } = require('../../../api/mailer');
module.exports = async ({ id, applyOk }) => {
    return await models.reservation
        .update(
            {
                applyOk,
            },
            { where: { id } },
        )
        .then(() => {
            if (parseInt(applyOk) === 1) sendMailOfReservationApplyOk(id);
            return parseInt(id);
        })
        .catch((err) => err);
};
