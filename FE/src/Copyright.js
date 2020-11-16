import { Link, Typography } from "@material-ui/core";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ marginTop: 45, marginBottom: 50 }}
    >
      {"Copyright © DANKOOK UNIVERSITY"}
      <Link color="inherit" href="/"></Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
