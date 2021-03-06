-- 사용자가 반납신청한 건을 제외한 예약서버 찾기
select r.id, r.serverId, r.start, r.end, name as serverName, os as serverOS from servers s join reservations r on s.id = r.serverId where r.userId=:userId and r.applyOk=1 and not exists ( select ret.reservationId from returns ret where r.id=ret.reservationId and r.applyOk!=2);

-- 해당 날짜에 이용가능한 서버 찾기
select id, name, os, cpu, ram from servers s where s.id not in (select r.serverId from reservations r where r.applyOk!=2 and (:start<=end and start<=:end) );

-- 서버 예약 날짜 (두달간)
select serverId, CASE WHEN start<'2020-11-20' and '2020-11-20'<=end THEN '2020-11-20' WHEN '2020-11-20' <=start and start<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) THEN start END as start, CASE WHEN '2020-11-20' <=end and end<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) THEN end WHEN start<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) and DATE_ADD('2020-11-20', INTERVAL 2 MONTH)<end THEN DATE_ADD('2020-11-20', INTERVAL 2 MONTH) END as end from reservations where serverId=:serverId and applyOk!=2 and end>='2020-11-20';

-- 서버 예약 현황  ( returnOk: 반납미완료 0, 반납완료 1 )
select r.id, r.start, r.end, r.serverId, u.name, u.department, IF ( EXISTS (select reservationId from returns where applyOk=1 and r.id=reservationId), 1, 0) as returnOK from users u join reservations r on u.userId = r.userId where r.applyOk=1;

-- 관리자가 승인해야할 반납 내역
select u.department, u.name as userName, r.start, r.end , s.name as serverName from returns ret join reservations r on r.id = ret.reservationId join users u  on u.userId = r.userId join servers s on s.id = r.serverId where ret.applyOk=0;

-- 승인 대기 중인 예약+반납 내역 수
select count(v.id) as waiting from ( select id as id from reservations where applyOk=0 UNION ALL select id as id from returns where applyOk=0) v;

-- 승인 대기 중인 예약 내역 수
select count(*) as waiting from reservations where applyOk=0;

-- 승인 대기 중인 반납 내역 수
select count(*) as waiting from returns where applyOk=0;

-- 반납예정일이 n일 남은 예약 내역 ( late: 반납기한남음 0, 반납기한지남 1 )
select r.id, u.department as userDepartment, u.name as userName, u.tel, r.start, r.end, s.id as serverId, s.name as serverName, IF( end<'2020-11-20', 1, 0 ) as late from reservations r join servers s on s.id = r.serverId join users u on r.userId = u.userId where r.applyOk=1 and end<=DATE_ADD('2020-11-20', INTERVAL 7 DAY) and NOT EXISTS(select reservationId from returns where reservationId=r.id and r.applyOk!=2);

-- 나의 예약 내역 ( returnOk: 반납승인대기 0, 반납승인완료 1, 반납승인거부 2, 미반납 3 )
select DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.os, r.applyOk, IF(ret.id, ret.applyOk, 3) as returnOk from reservations r join servers s on r.serverId = s.id left join returns ret on r.id = ret.reservationId where r.userId=:userId;

-- 서버 예약 확인서
select r.id, u.name as userName, u.department as userDepartment, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.name as serverName, s.id as serverId, s.os, s.cpu, s.ram, r.purpose from reservations r join users u on u.userId = r.userId join servers s on s.id = r.serverId where r.id=:reservationId;

-- 서버 반납 확인서
select ret.id , u.name as userName, u.department as userDepartment, DATE_FORMAT(ret.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.name as serverName, s.id as serverId, s.os, s.cpu, s.ram, ret.uses from reservations r join users u on u.userId = r.userId join servers s on s.id = r.serverId join returns ret on r.id=ret.reservationId where ret.id=:returnId;

-- 관리자 모든 예약 조회 ( returnOk: 반납승인대기 0, 반납승인완료 1, 반납승인거부 2, 미반납 3 )
select r.id, s.id as serverId, u.department as userDepartment, u.name as userName, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createAt, r.start, r.end, r.applyOk, IF(ret.id, ret.applyOk, 3) as returnOk from reservations r join servers s on r.serverId = s.id join users u on r.userId = u.userId left join returns ret on r.id = ret.reservationId where ;

-- hostservers 정보를 바탕으로 servers(container)의 row 추가 
insert into servers (name, os, cpu, ram, location, password, host, port, instanceName, hostId, createdAt, updatedAt) select :name , :os , cpu, ram, location, :password, host, CASE WHEN :os ='Ubuntu 20.04' THEN 11111 WHEN :os ='Ubuntu 18.04' THEN 11100 WHEN :os ='CentOS 8' THEN 10022 END, concat('dku-', replace(SUBSTRING_INDEX(:os,'.',1), ' ', '-')), :hostId , DATE_FORMAT(now(), '%Y-%m-%d %H:%i:%s'), DATE_FORMAT(now(), '%Y-%m-%d %H:%i:%s') from hostservers where id = :hostId;

-- 어제부로 예약 기간이 끝난 내역 ( 연장신청 건 제외 )
select serverId, userId from reservations r where not EXISTS( select serverId, userId from reservations where serverId=r.serverId and userId=r.userId and start=date(now()) and applyOk!=2) and end=DATE_ADD(date(now()), INTERVAL -1 DAY) and applyOk=1;

-- 예약 정보
select r.id as reservaionId, u.name as userName, u.userId, start, end, s.name as serverName, os as serverOS, host, port, s.password from users u join reservations r on u.userId = r.userId join servers s on s.id = r.serverId where r.id=:reservationId;
