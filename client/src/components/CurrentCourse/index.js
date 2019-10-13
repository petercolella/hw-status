import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import InactiveStudents from '../InactiveStudents';
import FilteredAssignments from '../FilteredAssignments';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0, 1, 1)
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  headingContainer: {
    display: 'flex',
    fontSize: 16,
    justifyContent: 'flex-start',
    margin: theme.spacing(0, 1)
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  }
}));

const CurrentCourse = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={4}>
      <Typography
        className={classes.headingContainer}
        variant="h6"
        gutterBottom>
        Current Course ID: {props.currentCourseId}
      </Typography>
      <div className={classes.buttonContainer}>
        <InactiveStudents
          assignments={props.assignments}
          courseDbId={props.courseDbId}
          inactiveStudents={props.inactiveStudents}
          loadData={props.loadData}
        />
        <FilteredAssignments
          assignments={props.assignments}
          courseDbId={props.courseDbId}
          filteredAssignments={props.filteredAssignments}
          loadData={props.loadData}
        />
      </div>
    </Paper>
  );
};

export default CurrentCourse;
