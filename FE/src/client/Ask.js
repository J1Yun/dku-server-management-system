import React from "react";
import { Grid, Container, Typography, Paper } from "@material-ui/core";

export default function Ask() {
  return (
    <Container component="main" maxWidth="sm" style={{ marginTop: 40 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={4} style={{ padding: 15 }}>
            <Grid
              container
              spacing={2}
              style={{ alignItems: "center", textAlign: "center" }}
            >
              <Grid item xs={12}>
                <Typography variant="h6">단국대학교 SW중심사업단</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography style={{ fontSize: 17 }}>
                  단국대학교 SW중심사업단
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography style={{ fontSize: 17 }}>
                  단국대학교 SW중심사업단
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
