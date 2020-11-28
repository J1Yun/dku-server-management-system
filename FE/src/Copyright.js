import { Link, Typography } from '@material-ui/core';

export default function Copyright() {
    return (
        <>
            <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                style={{ marginTop: 45, marginBottom: 5 }}
            >
                {'Copyright © '}
                <Link color="inherit" href="/?inspire=copyright">
                    {'DANKOOK UNIVERSITY'}
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                style={{ marginTop: 5, marginBottom: 50 }}
            >
                {'Team Harmonica'}
            </Typography>
        </>
    );
}
