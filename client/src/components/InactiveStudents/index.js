import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  },
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

const InactiveStudents = props => {
  console.log(props);
  const classes = useStyles();

  //   const nameArr = props.assignments
  //     .reduce((arr, assignment) => [...arr, assignment.studentName], [])
  //     .filter((name, i, arr) => arr.indexOf(name) === i);
  //   console.log('nameArr:', nameArr);

  const [open, setOpen] = useState(false);
  const [nameArr, setNameArr] = useState([]);
  const [state, setState] = useState({});

  const nameArrRef = useRef();
  nameArrRef.current = nameArr;

  useEffect(() => {
    setNameArr(
      Array.from(
        new Set(
          props.assignments.reduce(
            (arr, assignment) => [...arr, assignment.studentName],
            []
          )
        )
      )
    );

    setState(
      nameArrRef.current.reduce((nameObj, name) => {
        return {
          ...nameObj,
          [name]: props.inactiveStudents.includes(name)
        };
      }, {})
    );
  }, [props]);

  console.log('nameArr:', nameArr);
  console.log('state:', state);

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

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
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Assign responsibility</FormLabel>
              <FormGroup>
                {nameArr.map(name => (
                  <FormControlLabel
                    key={name}
                    control={
                      <Checkbox
                        checked={state.name}
                        onChange={handleChange(name)}
                        value={name}
                      />
                    }
                    label={name}
                  />
                ))}
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl>
          </div>
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
