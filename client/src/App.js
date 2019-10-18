import React, { useState, useEffect } from 'react';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send';

import CurrentCourse from './components/CurrentCourse';
import CustomTooltip from './components/CustomTooltip';
import Form from './components/Form';
import Header from './components/Header';
import SnackbarComponent from './components/SnackbarComponent';
import Table from './components/Table';

import API from './utils/API';
import './App.css';

import tooltipTitle from './utils/tooltipTitle.json';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2'
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
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -12
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  },
  wrapper: {
    display: 'inline-block',
    position: 'relative'
  }
}));

const filterTableData = data => {
  return data.assignments
    .map(assignment => {
      assignment['submitted'] =
        assignment['submitted'] === true ? '\u{2705}' : '\u274C';
      return { ...assignment, submitted: assignment['submitted'] };
    })
    .map(assignment => {
      assignment['grade'] =
        assignment['submitted'] === '\u{2705}' && assignment['grade'] === null
          ? 'Ungraded'
          : assignment['submitted'] === '\u274C' && assignment['grade'] === null
          ? 'Unsubmitted'
          : assignment['grade'];
      return { ...assignment, grade: assignment['grade'] };
    })
    .filter(assignment => !data.nonStudents.includes(assignment['studentName']))
    .filter(
      assignment =>
        !data.filteredAssignments.includes(assignment['assignmentTitle'])
    );
};

function App() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [courseDbId, setCourseDbId] = useState('');
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [error, setError] = useState({
    email: false,
    password: false,
    courseId: false
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [variant, setVariant] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('courseDbId');
    if (id) {
      loadData(id);
    }
  }, []);

  const loadData = id => {
    API.getCourse(id)
      .then(res => {
        if (res.data) {
          const filteredTableData = filterTableData(res.data);

          setAssignments(res.data.assignments);
          setCourseDbId(res.data._id);
          setCourseLoaded(true);
          setCurrentCourseId(res.data.courseId);
          setFilteredAssignments(res.data.filteredAssignments);
          setInactiveStudents(res.data.nonStudents);
          setTableData(filteredTableData);
        }
      })
      .catch(err => console.error(err));
  };

  const removeData = () => {
    setAssignments([]);
    setCourseDbId('');
    setCurrentCourseId('');
    setFilteredAssignments([]);
    setInactiveStudents([]);
    setTableData([]);
  };

  const handleFormError = () => {
    setError({
      email: email === '',
      password: password === '',
      courseId: courseId === ''
    });
    setSnackbarMessage('All Fields are Required');
    setVariant('warning');
    setSnackbarOpen(true);
  };

  const handleResError = err => {
    console.error(err);
    setSnackbarMessage(
      `${err.response.statusText}: ${err.response.data.message ||
        err.response.data}`
    );
    setVariant('error');
    setSnackbarOpen(true);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setCourseId('');
  };

  const clearFormAndLoadData = res => {
    localStorage.setItem('courseDbId', res.data._id);
    clearForm();
    loadData(res.data._id);
  };

  const clearFormAndRemoveData = res => {
    localStorage.removeItem('courseDbId');
    clearForm();
    removeData();
  };

  const deleteAssignments = () => {
    if (!email || !password || !courseId) {
      handleFormError();
    } else {
      if (!deleteLoading) {
        setDeleteLoading(true);
      }
      API.deleteAssignments({ email, password, courseId })
        .then(res => {
          clearFormAndRemoveData(res);
          setCourseLoaded(false);
          setDeleteLoading(false);
        })
        .catch(err => {
          handleResError(err);
          setDeleteLoading(false);
        });
    }
  };

  const populate = () => {
    if (!email || !password || !courseId) {
      handleFormError();
    } else {
      if (!loading) {
        setLoading(true);
      }
      API.populateAssignments({ email, password, courseId })
        .then(res => {
          clearFormAndLoadData(res);
          setCourseLoaded(true);
          setLoading(false);
        })
        .catch(err => {
          handleResError(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="App">
      <Header />
      <SnackbarComponent
        setError={setError}
        setSnackbarOpen={setSnackbarOpen}
        snackbarMessage={snackbarMessage}
        snackbarOpen={snackbarOpen}
        variant={variant}
      />
      <Container maxWidth="md">
        <Paper className={classes.paper} elevation={4}>
          <Form
            courseId={courseId}
            email={email}
            error={error}
            password={password}
            setCourseId={setCourseId}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          <div className={classes.buttonContainer}>
            <div className={classes.wrapper}>
              <CustomTooltip title={tooltipTitle.delete}>
                <Button
                  className={classes.button}
                  color="secondary"
                  disabled={deleteLoading}
                  onClick={deleteAssignments}
                  startIcon={<DeleteIcon />}
                  variant="contained">
                  Delete Course Data
                </Button>
              </CustomTooltip>
              {deleteLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <div className={classes.wrapper}>
              <ThemeProvider theme={theme}>
                <CustomTooltip title={tooltipTitle.submit}>
                  <Button
                    className={classes.button}
                    color="primary"
                    disabled={loading}
                    onClick={populate}
                    startIcon={<SendIcon />}
                    variant="contained">
                    Submit
                  </Button>
                </CustomTooltip>
              </ThemeProvider>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </div>
        </Paper>
        <CurrentCourse
          assignments={assignments}
          courseDbId={courseDbId}
          courseLoaded={courseLoaded}
          currentCourseId={currentCourseId}
          filteredAssignments={filteredAssignments}
          inactiveStudents={inactiveStudents}
          loadData={loadData}
        />
        <Table tableData={tableData} />
      </Container>
    </div>
  );
}

export default App;
