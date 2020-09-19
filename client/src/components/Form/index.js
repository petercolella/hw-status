import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(0, 1)
  },
  textField: {
    width: '100%'
  }
}));

const Form = props => {
  const classes = useStyles();
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Grid container direction="row" justify="space-between" spacing={2}>
        <Grid item xs>
          <TextField
            autoComplete="email"
            className={classes.textField}
            id="email"
            label="Email"
            type="email"
            value={props.email}
            onChange={e => props.setEmail(e.target.value)}
            margin="normal"
            error={props.error.email}
            helperText={props.error.email ? 'Please enter your email.' : ' '}
          />
        </Grid>
        <Grid item xs>
          <TextField
            autoComplete="current-password"
            className={classes.textField}
            id="password"
            label="Password"
            type="password"
            value={props.password}
            onChange={e => props.setPassword(e.target.value)}
            margin="normal"
            error={props.error.password}
            helperText={
              props.error.password ? 'Please enter your password.' : ' '
            }
          />
        </Grid>
        <Grid item xs>
          <TextField
            className={classes.textField}
            id="courseId"
            label="Course ID"
            type="number"
            value={props.courseId}
            onChange={e => props.setCourseId(e.target.value)}
            margin="normal"
            error={props.error.courseId}
            helperText={
              props.error.courseId ? 'Please enter a course ID.' : ' '
            }
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default Form;
