import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Font, Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import {
    TableHeader,
    TableCell,
    TableBody,
    Table,
    DataTableCell,
} from '@david.kucsai/react-pdf-table';
import moment from 'moment';
import { styles } from './docStyle';
import queryString from 'query-string';
import { useQuery } from 'react-apollo';
import { GET_DOC_RESERVATION } from '../queries';

import SnackMessage from '../client/components/SnackMessage';

Font.register({
    family: 'Nanum Gothic Bold',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf',
});

Font.register({
    family: 'Nanum Gothic',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
});

export default function ResDoc({ location }) {
    const id = queryString.parse(location.search).id;

    const [res, setRes] = useState({});
    const { loading, error, data } = useQuery(GET_DOC_RESERVATION, {
        variables: {
            id,
        },
    });

    useEffect(() => {
        if (data) {
            setRes({ ...data.getDocReservation[0] });
        }
    }, [data, setRes]);

    if (loading) return <CircularProgress />;
    if (error) return <SnackMessage message="잘못된 접근입니다." />;

    return (
        <>
            {res.id ? (
                <PDFViewer style={{ width: '100vw', height: '100vh' }}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.docTitle}>서버 예약 확인서</Text>
                            <View style={styles.resInfo}>
                                <Table data={[0]}>
                                    <TableHeader></TableHeader>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableName}
                                            getContent={() => '서버명'}
                                        />
                                        <DataTableCell
                                            style={styles.table}
                                            getContent={() => res.serverName}
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableName}
                                            getContent={() => '대여기간'}
                                        />
                                        <DataTableCell
                                            style={styles.table}
                                            getContent={() => `${res.start} ~ ${res.end}`}
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableName}
                                            getContent={() => '대여자 정보'}
                                        />
                                        <DataTableCell
                                            style={styles.table}
                                            getContent={() =>
                                                `${res.userDepartment} ${res.userName}`
                                            }
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tablePurposeHeight}
                                            getContent={() => '서버\n활용 용도'}
                                        />
                                        <DataTableCell
                                            style={styles.tablePurpose}
                                            getContent={() => res.purpose}
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableNameHeight}
                                            getContent={() => '대여자\n의무사항'}
                                        />
                                        <DataTableCell
                                            style={styles.tableHeight}
                                            getContent={() =>
                                                '1. 대여자는 대여받은 후 서버의 환경 셋팅을 확인한다.\n2. 반납 시 1번에서 확인한 환경과 초기 ID/PW로 셋팅하여 반납한다.\n3. 반납 시 서버 활요에 대한 간략한 결과보고서를 제출한다.'
                                            }
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableNameHeight}
                                            getContent={() => '신청 및 동의'}
                                        />
                                        <DataTableCell
                                            style={styles.tableHeight}
                                            getContent={() =>
                                                `위와 같이 『SW중심대학 사업단의 서버 대여』를 신청합니다.\n\n${res.createdAt}\n\n위 신청인 : ${res.userName}  (인)`
                                            }
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableName}
                                            getContent={() => '서버 세부사항'}
                                        />
                                        <DataTableCell
                                            style={styles.table}
                                            getContent={() =>
                                                `OS : ${res.os} / CPU : ${res.cpu} / RAM ${res.ram}GB`
                                            }
                                        />
                                    </TableBody>
                                </Table>
                            </View>
                            <View style={styles.tableSignPadding}>
                                <Table data={[0]}>
                                    <TableHeader>
                                        <TableCell style={styles.tableSignHeader}>담당자</TableCell>
                                        <TableCell style={styles.tableSignHeader}>
                                            담당교수
                                        </TableCell>
                                        <TableCell style={styles.tableSignHeader}>센터장</TableCell>
                                    </TableHeader>
                                    <TableBody>
                                        <DataTableCell
                                            style={styles.tableSign}
                                            getContent={() => `　`}
                                        />
                                        <DataTableCell
                                            style={styles.tableSign}
                                            getContent={() => `　`}
                                        />
                                        <DataTableCell
                                            style={styles.tableSign}
                                            getContent={() => `　`}
                                        />
                                    </TableBody>
                                </Table>
                            </View>
                            <View style={styles.copyright} fixed>
                                <Text style={styles.copyrightText}>
                                    본 문서는 단국대학교 서버관리시스템에서 자동으로 생성된
                                    문서입니다.
                                </Text>
                                <Text>
                                    RID: {res.id} / 출력일 {moment().format('YYYY-MM-DD HH:mm:ss')}
                                </Text>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            ) : (
                <SnackMessage message="잘못된 접근입니다." />
            )}
        </>
    );
}
