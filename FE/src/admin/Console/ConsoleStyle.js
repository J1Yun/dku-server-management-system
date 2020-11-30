import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(1.5),
    },
    table: {
        minWidth: 600,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    hostConsoleTableRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#E3F2FF',
        },
    },
}));
