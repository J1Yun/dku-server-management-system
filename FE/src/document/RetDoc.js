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
import { GET_DOC_RETURN } from '../queries';

import SnackMessage from '../client/components/SnackMessage';

Font.register({
    family: 'Nanum Gothic Bold',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf',
});

Font.register({
    family: 'Nanum Gothic',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
});

export default function RetDoc({ location }) {
    const id = queryString.parse(location.search).id;

    const [ret, setRet] = useState({});
    const { loading, error, data } = useQuery(GET_DOC_RETURN, {
        variables: {
            id,
        },
    });

    useEffect(() => {
        if (data) {
            setRet({ ...data.getDocReturn[0] });
        }
    }, [data, setRet]);

    if (loading) return <CircularProgress />;
    if (error) return <SnackMessage message="잘못된 접근입니다." />;

    return (
        <>
            {ret.id ? (
                <PDFViewer style={{ width: '100vw', height: '100vh' }}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.docTitle}>서버 반납 확인서</Text>
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
                                            getContent={() => ret.serverName}
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
                                                `OS : ${ret.os} / CPU : ${ret.cpu} / RAM ${ret.ram}GB`
                                            }
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
                                            getContent={() => `${ret.start} ~ ${ret.end}`}
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
                                                `${ret.userDepartment} ${ret.userName}`
                                            }
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableUsesHeight}
                                            getContent={() => '사용\n결과\n보고서'}
                                        />
                                        <DataTableCell
                                            style={styles.tableUses}
                                            getContent={() => ret.uses}
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableNameHeight}
                                            getContent={() => '반납 검수'}
                                        />
                                        <DataTableCell
                                            style={styles.tableHeight}
                                            getContent={() =>
                                                `위와 같이 『SW중심대학 사업단의 서버 반납과 검수』를 신청합니다.\n\n${ret.createdAt}\n\n위 신청인 : ${ret.userName}  (인)`
                                            }
                                        />
                                    </TableBody>
                                </Table>
                                <Table data={[0]}>
                                    <TableBody>
                                        <DataTableCell
                                            weighting={0.2}
                                            style={styles.tableName}
                                            getContent={() => '서버 확인'}
                                        />
                                        <DataTableCell
                                            style={styles.table}
                                            getContent={() => `□ 운영체제 설치 확인   □ ID/PW 확인`}
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
                                    RID: {ret.id} / 출력일 {moment().format('YYYY-MM-DD HH:mm:ss')}
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
