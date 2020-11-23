import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Font, Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
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
                            <Text style={styles.title} fixed>
                                단국대학교 SW중심사업단
                            </Text>
                            <Text style={styles.text} fixed>
                                서버관리시스템
                            </Text>
                            <Text style={styles.docTitle}>서버 예약 확인서</Text>
                            <Text style={styles.centerText}>
                                본 확인서를 통해 서버 예약이 정상적으로 이루어졌음을 증명합니다.
                            </Text>
                            <View style={styles.resInfo}>
                                <Text style={styles.infoTitle}>- 예약 내용 (아래) -</Text>
                                <Text style={styles.infoText}>예약자명: {res.userName}</Text>
                                <Text style={styles.infoText}>
                                    예약자 소속: {res.userDepartment}
                                </Text>
                                <Text style={styles.infoText}>예약 신청일: {res.createdAt}</Text>
                                <Text style={styles.infoText}>시작일: {res.start}</Text>
                                <Text style={styles.infoText}>반납일: {res.end}</Text>
                                <Text style={styles.infoText}>
                                    예약된 서버: {res.serverName} (ID: {res.serverId})
                                </Text>
                                <Text style={styles.infoText}>
                                    서버 세부사항: OS {res.os} / CPU {res.cpu} / RAM {res.ram}GB
                                </Text>
                                <Text style={styles.infoText}>사용 목적: {res.purpose}</Text>
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
