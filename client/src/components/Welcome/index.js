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
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    textAlign: 'center'
  }
}));

const Welcome = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="xl" onClose={handleClose} open={open}>
      <div className={classes.dialog}>
        <DialogTitle disableTypography>
          <Typography align="center" variant="h2">
            Homework Status
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welcome! This app uses the Bootcamp Spot grades API.
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
