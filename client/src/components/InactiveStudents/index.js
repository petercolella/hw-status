import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CustomTooltip from '../CustomTooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import API from '../../utils/API';
import tooltipTitle from '../../utils/tooltipTitle.json';

const CustomButton = withStyles(theme => ({
  root: {
    color: '#fff',
    backgroundColor: '#14c6e6',
    '&:hover': {
      backgroundColor: '#37bcdb'
    }
  }
}))(Button);

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0, 1, 1),
    padding: '6px 16px'
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

  const { assignments, courseDbId, inactiveStudents, loadData } = props;

  const [open, setOpen] = useState(false);
  const [nameArr, setNameArr] = useState([]);
  const [state, setState] = useState({});

  const createNameArr = assignments => {
    const newNameArr = Array.from(
      new Set(
        assignments.reduce(
          (arr, assignment) => [...arr, assignment.studentName],
          []
        )
      )
    ).sort();
    setNameArr(newNameArr);
  };

  const nameArrRef = useRef();
  nameArrRef.current = nameArr;

  const createNameObject = useCallback(() => {
    const newNameObj = nameArrRef.current.reduce((nameObj, name) => {
      return {
        ...nameObj,
        [name]: inactiveStudents.includes(name)
      };
    }, {});
    setState(newNameObj);
  }, [inactiveStudents]);

  useEffect(() => {
    createNameArr(assignments);
    createNameObject();
  }, [assignments, createNameObject]);

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (courseDbId) loadData(courseDbId);
    setOpen(false);
  };

  const handleSubmit = () => {
    const newInactiveStudents = [];

    Object.keys(state).forEach(name => {
      if (state[name] === true) {
        newInactiveStudents.push(name);
      }
    });

    const courseData = {
      nonStudents: newInactiveStudents
    };

    if (courseDbId)
      API.updateCourse(courseDbId, courseData)
        .then(res => handleClose())
        .catch(err => console.error(err));
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
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
            <FormControl
              component="fieldset"
              className={classes.formControl}
              fullWidth={true}>
              <FormGroup row>
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
              <FormHelperText>
                *Deselected students will return to the table.
              </FormHelperText>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={!courseDbId} onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <CustomTooltip title={tooltipTitle.inactive}>
        <CustomButton
          className={classes.button}
          color="primary"
          onClick={handleClickOpen}
          startIcon={<EditIcon />}>
          Inactive Students
        </CustomButton>
      </CustomTooltip>
    </div>
  );
};

export default InactiveStudents;
