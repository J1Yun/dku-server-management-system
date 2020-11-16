const models = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
    post_signup: async (req, res) =>
        await models.user
            .create({
                ...req.body.user,
            })
            .then((result) => res.json({ userId: result.dataValues.userId }))
            .catch((error) => res.status(409).json({ error })),

    post_signin: async (req, res) => {
        const { userId, password } = req.body.user;
        const secret = req.app.get('jwt-secret');

        return await models.user
            .findOne({
                attributes: ['id', 'userId', 'name', 'department', 'tel', 'penalty', 'type'],
                where: { userId, password },
                raw: true,
            })
            .then((user) => {
                if (user) {
                    // Success signin, generate jwt
                    jwt.sign(
                        {
                            ...user,
                        },
                        secret,
                        {
                            expiresIn: '7d',
                            issuer: 'sms.dankook.ac.kr',
                            subject: 'user',
                        },
                        (error, token) => {
                            if (error) res.status(409).json({ error });
                            // send final user info
                            res.cookie('x-access-token', token, { httpOnly: true });
                            res.json({
                                message: 'Sign-in Successfully',
                                token,
                                type: parseInt(user.type),
                            });
                        },
                    );
                } else {
                    res.status(409).json({ error: { name: 'invalid' } });
                }
            })
            .catch((error) => res.status(409).json({ error }));
    },
};
