import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

import CustomTooltip from './components/CustomTooltip';
import FilteredAssignments from './components/FilteredAssignments';
import Form from './components/Form';
import InactiveStudents from './components/InactiveStudents';
import SnackbarContentWrapper from './components/SnackbarContentWrapper';
import Table from './components/Table';

import API from './utils/API';
import logo from './trilogy.png';
import './App.css';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative'
  },
  button: {
    margin: theme.spacing(2)
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
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
          ? 'Unsubmitted & Ungraded'
          : assignment['grade'];
      return { ...assignment, grade: assignment['grade'] };
    })
    .filter(assignment => !data.nonStudents.includes(assignment['studentName']))
    .filter(
      assignment =>
        !data.filteredAssignments.includes(assignment['assignmentTitle'])
    );
};

function TransitionUp(props) {
  return <Slide {...props} direction="down" />;
}

function App() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [courseDbId, setCourseDbId] = useState('');
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
      setCourseDbId(id);
    }
  }, []);

  const loadData = id => {
    API.getCourse(id)
      .then(res => {
        if (res.data) {
          const filteredTableData = filterTableData(res.data);

          setAssignments(res.data.assignments);
          setFilteredAssignments(res.data.filteredAssignments);
          setInactiveStudents(res.data.nonStudents);
          setTableData(filteredTableData);
        }
      })
      .catch(err => console.error(err));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    setTimeout(
      () =>
        setError({
          email: false,
          password: false,
          courseId: false
        }),
      2000
    );
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

  const clearFormAndLoadData = res => {
    setEmail('');
    setPassword('');
    setCourseId('');
    loadData(res.data._id);
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

  const deleteAssignments = () => {
    if (!email || !password || !courseId) {
      handleFormError();
    } else {
      if (!deleteLoading) {
        setDeleteLoading(true);
      }
      API.deleteAssignments({ email, password, courseId })
        .then(res => {
          localStorage.removeItem('courseDbId');
          clearFormAndLoadData(res);
          setCourseDbId('');
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
          localStorage.setItem('courseDbId', res.data._id);
          clearFormAndLoadData(res);
          setCourseDbId(res.data._id);
          setLoading(false);
        })
        .catch(err => {
          handleResError(err);
          setLoading(false);
        });
    }
  };

  const tooltipTitle =
    'Only the API data will be deleted. Inactive students and filtered assignments will remain in the database.';

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Snackbar
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        TransitionComponent={TransitionUp}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        open={snackbarOpen}>
        <SnackbarContentWrapper
          message={snackbarMessage}
          onClose={handleSnackbarClose}
          variant={variant}
        />
      </Snackbar>
      <Container maxWidth="lg">
        <Form
          courseId={courseId}
          email={email}
          error={error}
          password={password}
          setCourseId={setCourseId}
          setEmail={setEmail}
          setPassword={setPassword}
        />
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            color="primary"
            disabled={loading}
            onClick={populate}
            startIcon={<SendIcon />}
            variant="contained">
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
        <div className={classes.wrapper}>
          <CustomTooltip title={tooltipTitle}>
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
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
        <InactiveStudents
          assignments={assignments}
          courseDbId={courseDbId}
          inactiveStudents={inactiveStudents}
          loadData={loadData}
        />
        <FilteredAssignments
          assignments={assignments}
          courseDbId={courseDbId}
          filteredAssignments={filteredAssignments}
          loadData={loadData}
        />
        <Table tableData={tableData} />
      </Container>
    </div>
  );
}

export default App;
