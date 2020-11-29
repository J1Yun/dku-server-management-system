export const menus = {
    client: [
        {
            id: 1,
            name: '예약하기',
            link: '/client/apply_reservation',
        },
        {
            id: 2,
            name: '반납하기',
            link: '/client/apply_return',
        },

        {
            id: 3,
            name: '예약확인',
            link: '/client/confirm_reservation',
        },
        {
            id: 4,
            name: '이용문의',
            link: '/client/ask',
        },
    ],
    admin: [
        {
            id: 1,
            name: '대시보드',
            link: '/admin/dashboard',
        },
        {
            id: 2,
            name: '캘린더',
            link: '/admin/calendar',
        },
        {
            id: 3,
            name: '승인처리',
            link: '/admin/confirm',
        },
        {
            id: 4,
            name: '예약조회',
            link: '/admin/reservations',
        },
        {
            id: 5,
            name: '회원조회',
            link: '/admin/members',
        },
    ],
};
