const { Router } = require('express');
const router = Router();

const ctrl = require('./user.ctrl');

router.post('/signup', ctrl.post_signup);
router.post('/signin', ctrl.post_signin);

module.exports = router;
