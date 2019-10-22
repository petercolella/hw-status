import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
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

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={handleClose}
      open={open}
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
            {/* <ul> */}
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
            {/* </ul> */}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Continue
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default Welcome;
