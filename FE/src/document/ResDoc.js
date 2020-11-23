import React from 'react';
import { Font, Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import { styles } from './docStyle';

Font.register({
    family: 'Nanum Gothic Bold',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf',
});

Font.register({
    family: 'Nanum Gothic',
    src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
});

export default function ResDoc({ id }) {
    return (
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
                        <Text style={styles.infoText}>예약자명: 홍길동</Text>
                        <Text style={styles.infoText}>예약자 소속: 소프트웨어학과</Text>
                        <Text style={styles.infoText}>예약 신청일: 2020년 10월 15일</Text>
                        <Text style={styles.infoText}>시작일: 2020년 10월 20일</Text>
                        <Text style={styles.infoText}>반납일: 2020년 11월 20일</Text>
                        <Text style={styles.infoText}>예약된 서버: SW-1서버 (ID: 1)</Text>
                        <Text style={styles.infoText}>
                            서버 세부사항: OS Ubuntu 18.04 / CPU 1 / RAM 8GB
                        </Text>
                        <Text style={styles.infoText}>사용 목적: 가나다라</Text>
                    </View>
                    <View style={styles.copyright} fixed>
                        <Text style={styles.copyrightText}>
                            본 문서는 단국대학교 서버관리시스템에서 자동으로 생성된 문서입니다.
                        </Text>
                        <Text>RID: 5 / 출력일 {moment().format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}
