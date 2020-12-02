const models = require('../../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

const createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ password: key.toString('base64'), salt });
        });
    });

const makePasswordHashed = (userId, plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await models.user
            .findOne({
                attributes: ['salt'],
                raw: true,
                where: {
                    userId,
                },
            })
            .then((result) => result.salt);
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    });

module.exports = {
    post_signup: async (req, res) => {
        const { password, salt } = await createHashedPassword(req.body.user.password);
        return await models.user
            .create({
                ...req.body.user,
                password,
                salt,
            })
            .then((result) => res.json({ userId: result.dataValues.userId }))
            .catch((error) => res.json({ error }));
    },

    post_signin: async (req, res) => {
        const { userId, password: plainPassword } = req.body.user;
        const password = await makePasswordHashed(userId, plainPassword);
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

    post_logout: (_, res) => {
        res.clearCookie('x-access-token');
        res.json({
            message: 'Logout Successfully',
        });
    },
};
