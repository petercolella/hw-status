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

const FilteredAssignments = props => {
  const classes = useStyles();

  const { assignments, courseDbId, filteredAssignments, loadData } = props;

  const [open, setOpen] = useState(false);
  const [titleArr, setTitleArr] = useState([]);
  const [state, setState] = useState({});

  const createTitleArr = assignments => {
    const newTitleArr = Array.from(
      new Set(
        assignments.reduce(
          (arr, assignment) => [...arr, assignment.assignmentTitle],
          []
        )
      )
    ).sort();
    setTitleArr(newTitleArr);
  };

  const titleArrRef = useRef();
  titleArrRef.current = titleArr;

  const createTitleObject = useCallback(() => {
    const newTitleObj = titleArrRef.current.reduce((titleObj, title) => {
      return {
        ...titleObj,
        [title]: filteredAssignments.includes(title)
      };
    }, {});
    setState(newTitleObj);
  }, [filteredAssignments]);

  useEffect(() => {
    createTitleArr(assignments);
    createTitleObject();
  }, [assignments, createTitleObject]);

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
    const newFilteredTitles = [];

    Object.keys(state).forEach(name => {
      if (state[name] === true) {
        newFilteredTitles.push(name);
      }
    });

    const courseData = {
      filteredAssignments: newFilteredTitles
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
          Select Filtered Assignments
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selected assignments will not appear in the table.
          </DialogContentText>
          <div className={classes.root}>
            <FormControl
              component="fieldset"
              className={classes.formControl}
              fullWidth={true}>
              <FormGroup row>
                {titleArr.map(title => (
                  <FormControlLabel
                    key={title}
                    control={
                      <Checkbox
                        checked={state[title]}
                        onChange={handleChange(title)}
                        value={title}
                      />
                    }
                    label={title}
                  />
                ))}
              </FormGroup>
              <FormHelperText>
                *Deselected assignmets will return to the table.
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
      <CustomTooltip title={tooltipTitle.filtered}>
        <CustomButton
          className={classes.button}
          color="primary"
          onClick={handleClickOpen}
          startIcon={<EditIcon />}>
          Filtered Assignments
        </CustomButton>
      </CustomTooltip>
    </div>
  );
};

export default FilteredAssignments;
