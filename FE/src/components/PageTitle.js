import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function PageTitle({ title }) {
    return (
        <Typography
            style={{
                marginTop: 10,
                marginBottom: 20,
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#111',
            }}
        >
            {title}
        </Typography>
    );
}
