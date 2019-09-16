import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  }
}));

const InactiveStudents = props => {
  console.log(props);
  const classes = useStyles();

  const nameArr = props.assignments
    .reduce((arr, assignment) => [...arr, assignment.studentName], [])
    .filter((name, i, arr) => arr.indexOf(name) === i);
  console.log('nameArr:', nameArr);

  const nameArr2 = Array.from(
    new Set(
      props.assignments.reduce(
        (arr, assignment) => [...arr, assignment.studentName],
        []
      )
    )
  );
  console.log('nameArr2:', nameArr2);

  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        scroll={'body'}>
        <DialogTitle id="form-dialog-title">
          Select Inactive Students
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selected students will not appear in the table.
          </DialogContentText>
          <TextField
            id="nudgeFrequencyUnit"
            select
            label="Frequency Unit"
            type="text"
            fullWidth
            value="Please Select"
            // onChange={props.handleInputChange('nudgeFrequencyUnit')}
            margin="normal"
            variant="outlined">
            <MenuItem value="seconds">seconds</MenuItem>
            <MenuItem value="minutes">minutes</MenuItem>
            <MenuItem value="hours">hours</MenuItem>
            <MenuItem value="days">days</MenuItem>
            <MenuItem value="weeks">weeks</MenuItem>
            <MenuItem value="months">months</MenuItem>
            <MenuItem value="years">years</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        className={classes.button}
        // variant="contained"
        color="secondary"
        onClick={handleClickOpen}>
        View/Edit Inactive Students
      </Button>
    </div>
  );
};

export default InactiveStudents;
