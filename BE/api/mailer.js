const nodemailer = require('nodemailer');
const mailerConf = require('../conf/secret').mailer;
const models = require('../models');

// mail: to, subject, text, html
const sendMail = (mail) =>
    new Promise(async (resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: mailerConf.user,
                pass: mailerConf.pass,
            },
        });
        const send = await transporter.sendMail({
            from: mailerConf.from,
            ...mail,
        });
        console.log(`Mail sent: ${send.messageId}`);
        resolve(send.messageId);
    });

const sendMailOfResetPassword = async (name, userId, newPassword) => {
    const mail = {
        to: userId,
        subject: `[단국대학교] ${name}님의 비밀번호가 초기화되었습니다.`,
        text: `${name}님의 새로운 비밀번호를 확인하세요.`,
        html: `<div style="color: black"><ul style="font-size: 16px; background: #eee; border-radius: 10px; padding: 15px; list-style: none">
        <li>이메일 주소(아이디): ${userId}</li>
        <li>새로운 비밀번호: ${newPassword}</li>
        <li>* 로그인 후 반드시 비밀번호를 변경하세요.</li>
    </ul>
    <p style="margin-top: 35px; text-align: center; font-size: 18px">단국대학교 서버관리시스템</p>
    <p style="margin-top: 15px; text-align: center; font-size: 12px; color: '#999'">
        본 메일은 발신 전용입니다.
    </p></div>`,
    };
    return await sendMail(mail);
};

const sendMailOfReservationApplyOk = async (reservationId) => {
    const query =
        'select r.id as reservaionId, u.name as userName, u.userId, start, end, s.name as serverName, os as serverOS, host, port, s.password from users u join reservations r on u.userId = r.userId join servers s on s.id = r.serverId where r.id=:reservationId;';
    const resInfo = await models.sequelize.query(query, { replacements: { reservationId } }).spread(
        (results) => results[0],
        (error) => error,
    );
    const mail = {
        to: resInfo.userId,
        subject: `[단국대학교] ${resInfo.userName}님의 서버 예약이 승인되었습니다.`,
        text: `${resInfo.userName}님의 ${resInfo.serverName} 서버가 정상적으로 예약 승인되었습니다.`,
        html: `<div style="color: black"><ul style="font-size: 16px; background: #eee; border-radius: 10px; padding: 15px; list-style: none">
        <li>예약자명: ${resInfo.userName}</li>
        <li>예약된 서버: ${resInfo.serverName} / ${resInfo.serverOS}</li>
        <li>사용 기간: ${resInfo.start} 00시 ~ ${resInfo.end} 24시</li>
        <li style="color: red">
            접속 정보: IP: ${resInfo.host} / PORT: ${resInfo.port} / PASSWORD: ${resInfo.password}
        </li>
    </ul>
    <p>예약 정보를 정확히 확인하세요.</p>
    <p>연장 신청은 반납일 최소 3일 전 같은 서버로 다시 예약 신청하세요.</p>
    <p>물리서버 반납 시 서버를 예약 초기 상태로 원복 후 반납 신청하세요.</p>
    <p>예약 문서(PDF)는 [예약조회]에서 출력할 수 있습니다.</p>
    <p style="margin-top: 35px; text-align: center; font-size: 18px">단국대학교 서버관리시스템</p>
    <p style="margin-top: 15px; text-align: center; font-size: 12px; color: '#999'">
        본 메일은 발신 전용입니다.
    </p></div>
    `,
    };
    return await sendMail(mail);
};

module.exports = {
    sendMailOfResetPassword,
    sendMailOfReservationApplyOk,
};
