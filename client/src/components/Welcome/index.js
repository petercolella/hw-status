import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2)
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  contentText: {
    margin: '0 auto',
    padding: 0,
    '& li': {
      listStyleType: 'none',
      textAlign: 'left'
    }
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    textAlign: 'center'
  },
  title: {
    padding: theme.spacing(3, 4)
  }
}));

const Welcome = () => {
  const classes = useStyles();

  const showWelcome =
    localStorage.getItem('show') !== null
      ? JSON.parse(localStorage.getItem('show'))
      : true;

  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(showWelcome);

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleClose = () => {
    localStorage.setItem('show', !checked);
    setShow(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={handleClose}
      open={show}
      scroll={'body'}>
      <div className={classes.dialog}>
        <DialogTitle className={classes.title} disableTypography>
          <Typography align="center" variant="h2">
            Homework Status
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.content} dividers>
          <DialogContentText color="textPrimary" variant="h5">
            Welcome!
          </DialogContentText>
          <DialogContentText>
            This app uses the Bootcamp Spot Grades API.
          </DialogContentText>
          <DialogContentText>
            Enter your email address and password, along with the course ID of
            your cohort.
          </DialogContentText>
          <DialogContentText>
            If you would like a demo, enter:
          </DialogContentText>
          <Typography
            className={classes.contentText}
            color="textSecondary"
            component="ul"
            variant="body1">
            <li>
              Email &mdash;{' '}
              <strong>
                <em>test@test.com</em>
              </strong>
            </li>
            <li>
              Password &mdash;{' '}
              <strong>
                <em>test</em>
              </strong>
            </li>
            <li>
              Course ID &mdash;{' '}
              <strong>
                <em>1111</em>
              </strong>
            </li>
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  value="checked"
                  color="default"
                />
              }
              label="Don't show again"
            />
          </FormGroup>
          <Button onClick={handleClose} color="primary">
            Continue
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default Welcome;
