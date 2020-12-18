import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        fontFamily: 'Nanum Gothic',
        fontSize: 13,
        padding: 15,
    },
    title: {
        fontSize: 15,
        textAlign: 'justify',
        fontFamily: 'Nanum Gothic Bold',
    },
    docTitle: {
        fontFamily: 'Nanum Gothic Bold',
        fontSize: 19,
        textAlign: 'center',
        marginTop: 80,
    },
    text: {
        textAlign: 'justify',
    },
    centerText: {
        textAlign: 'center',
    },
    resInfo: {
        marginTop: 25,
        paddingLeft: 20,
        paddingRight: 20,
    },
    infoTitle: {
        marginBottom: 50,
        textAlign: 'center',
    },
    infoText: {
        marginTop: 15,
    },
    copyright: {
        position: 'absolute',
        fontSize: 12,
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    copyrightText: {
        color: '#333',
        marginBottom: 3,
    },
    tableName: {
        textAlign: 'center',
        height: 40,
        backgroundColor: '#C0C0C0',
    },
    table: {
        height: 40,
        textAlign: 'center',
    },
    tableHeight: {
        height: 120,
        textAlign: 'center',
    },
    tableNameHeight: {
        height: 120,
        textAlign: 'center',
        backgroundColor: '#C0C0C0',
    },
    tableSignHeader: {
        height: 20,
        fontSize: 11,
        textAlign: 'center',
    },
    tableSign: {
        height: 40,
    },
    tableSignPadding: {
        paddingTop: 5,
        paddingLeft: 330,
        paddingRight: 20,
    },
    tablePurposeHeight: {
        height: 100,
        backgroundColor: '#C0C0C0',
        textAlign: 'center',
    },
    tablePurpose: {
        textAlign: 'center',
        height: 100,
    },
    tableUses: {
        textAlign: 'center',
        height: 130,
    },
    tableUsesHeight: {
        textAlign: 'center',
        height: 130,
        backgroundColor: '#C0C0C0',
    },
});
