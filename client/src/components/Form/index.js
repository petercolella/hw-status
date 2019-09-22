import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 200
  }
}));

const Form = props => {
  const classes = useStyles();
  return (
    <form className={classes.container} noValidate autoComplete="off">
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
        helperText={props.error.email ? 'Please enter your email.' : ''}
      />
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
        helperText={props.error.password ? 'Please enter your password.' : ''}
      />
      <TextField
        className={classes.textField}
        id="courseId"
        label="Course ID"
        type="number"
        value={props.courseId}
        onChange={e => props.setCourseId(e.target.value)}
        margin="normal"
        error={props.error.courseId}
        helperText={props.error.courseId ? 'Please enter a course ID.' : ''}
      />
    </form>
  );
};

export default Form;
