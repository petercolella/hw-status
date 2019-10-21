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
    // paddingLeft: '3.75rem',
    // paddingRight: '3.75rem'
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    textAlign: 'center'
  },
  title: {
    padding: theme.spacing(4)
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
        <DialogContent className={classes.content}>
          <DialogContentText className={classes.contentText} variant="h5">
            Welcome!
          </DialogContentText>
          <DialogContentText className={classes.contentText}>
            This app uses the Bootcamp Spot Grades API. Enter your email address
            and password, along with the course ID of your cohort.
          </DialogContentText>
          <DialogContentText className={classes.contentText}>
            If you would like a demo, use Email: <em>test@test.com</em>,
            Password: <em>test</em>, and Course ID: <em>1111</em>.
          </DialogContentText>
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
