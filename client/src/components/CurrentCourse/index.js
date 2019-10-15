import React from 'react';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles';
import { Collapse, Grid, Paper, Typography } from '@material-ui/core';
import InactiveStudents from '../InactiveStudents';
import FilteredAssignments from '../FilteredAssignments';

const theme = createMuiTheme({
  typography: {
    h6: {
      textAlign: 'left'
    }
  },
  overrides: {
    MuiTypography: {
      h6: {
        textAlign: 'left'
      }
    }
  }
});

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0, 1, 1)
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  grid: {
    padding: theme.spacing(0, 2)
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  }
}));

const CurrentCourse = props => {
  const classes = useStyles();

  return (
    <Collapse in={props.courseLoaded} timeout={'auto'}>
      <Paper className={classes.paper} elevation={4}>
        <Grid
          className={classes.grid}
          container
          direction="row"
          justify="space-between">
          <Grid item xs>
            <ThemeProvider theme={theme}>
              <Typography variant="h6" gutterBottom>
                Current Course ID: {props.currentCourseId}
              </Typography>
            </ThemeProvider>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
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
    </Collapse>
  );
};

export default CurrentCourse;
