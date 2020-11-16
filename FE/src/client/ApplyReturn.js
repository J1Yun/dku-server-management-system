import React, { useState, useCallback } from "react";
import {
  Button,
  CssBaseline,
  Grid,
  Typography,
  Container,
  Snackbar,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import SnackMessage from "./components/SnackMessage";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

const initialReturn = {
  reservationId: null,
  uses: "",
  rating: 5,
  review: "",
};

export default function ApplyReturn() {
  const classes = useStyles();

  const [myReturn, setMyReturn] = useState(initialReturn);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setMyReturn({ ...myReturn, [name]: value });
    },
    [myReturn]
  );

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar>
        <Typography component="h1" variant="h5">
          서버 반납신청
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>반납건 선택</InputLabel>
                <Select
                  name="reservationId"
                  value={myReturn.reservationId}
                  onChange={handleChange}
                  label="반납건 선택"
                  required
                >
                  <MenuItem value="">
                    <em>반납건 선택</em>
                  </MenuItem>
                  <MenuItem value={1}>~2019-11-16 Ubuntu</MenuItem>
                  <MenuItem value={2}>~2019-11-23 CentOS</MenuItem>
                  <MenuItem value={3}>~2019-11-26 Ubuntu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="uses"
                variant="outlined"
                label="사용 상세"
                multiline
                value={myReturn.uses}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  textAlign: "center",
                  paddingTop: 10,
                }}
              >
                서비스 만족도 조사 (선택사항)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                style={{
                  fontSize: 17,
                  textAlign: "right",
                  marginRight: 33,
                  paddingBottom: 3,
                }}
              >
                만족도 별점
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Rating
                name="rating"
                value={myReturn.rating}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="review"
                variant="outlined"
                label="서비스 이용 후기"
                multiline
                value={myReturn.review}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <SnackMessage message="서버를 초기 상태로 원복하지 않거나 반납일을 초과하는 경우 페널티가 부여됩니다. 서비스 이용에 불편함이 있으셨다면 이용 후기에 내용을 적어주세요." />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
          >
            서버 반납신청
          </Button>
        </form>
      </div>
    </Container>
  );
}
