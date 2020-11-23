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
        marginBottom: 60,
        marginTop: 70,
    },
    text: {
        textAlign: 'justify',
    },
    centerText: {
        textAlign: 'center',
    },
    resInfo: {
        marginTop: 70,
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
});
