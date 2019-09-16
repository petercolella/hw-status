import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import API from '../../utils/API';

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
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [nameArr, setNameArr] = useState([]);
  const [state, setState] = useState({});

  const createNameArr = props => {
    const newNameArr = Array.from(
      new Set(
        props.assignments.reduce(
          (arr, assignment) => [...arr, assignment.studentName],
          []
        )
      )
    );
    setNameArr(newNameArr);
  };

  const nameArrRef = useRef();
  nameArrRef.current = nameArr;

  const createNameObject = useCallback(() => {
    const newNameObj = nameArrRef.current.reduce((nameObj, name) => {
      return {
        ...nameObj,
        [name]: props.inactiveStudents.includes(name)
      };
    }, {});
    setState(newNameObj);
  }, [props]);

  useEffect(() => {
    createNameArr(props);
    createNameObject();
  }, [props, createNameObject]);

  console.log('Inactive Students Component is rendering.');

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    const newInactiveStudents = [];

    Object.keys(state).forEach(name => {
      if (state[name] === true) {
        newInactiveStudents.push(name);
      }
    });

    const courseData = {
      nonStudents: newInactiveStudents
    };

    API.updateCourse(props.courseDbId, courseData)
      .then(res => console.log(res, res))
      .catch(err => console.error(err));

    handleClose();
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
                        checked={state[name]}
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
          <Button onClick={handleSubmit} color="primary">
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
