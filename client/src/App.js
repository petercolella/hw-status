import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';

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

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 20,
    padding: theme.spacing(1)
  }
}))(Tooltip);

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
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseDbId, setCourseDbId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState({
    email: false,
    password: false,
    courseId: false
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  function handleSnackbarClose(event, reason) {
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
  }

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

  const deleteAssignments = () => {
    if (!email || !password || !courseId) {
      setError({
        email: email === '',
        password: password === '',
        courseId: courseId === ''
      });
      setSnackbarMessage('All Fields are Required');
      setVariant('warning');
      setSnackbarOpen(true);
    } else {
      if (!deleteLoading) {
        setDeleteLoading(true);
      }
      API.deleteAssignments({ email, password, courseId })
        .then(res => {
          localStorage.removeItem('courseDbId');
          setEmail('');
          setPassword('');
          setCourseId('');
          setCourseDbId('');
          loadData(res.data._id);
          setDeleteLoading(false);
        })
        .catch(err => {
          console.error(err);
          setSnackbarMessage(
            `${err.response.statusText}: ${err.response.data.message ||
              err.response.data}`
          );
          setDeleteLoading(false);
          setVariant('error');
          setSnackbarOpen(true);
        });
    }
  };

  const populate = () => {
    if (!email || !password || !courseId) {
      setError({
        email: email === '',
        password: password === '',
        courseId: courseId === ''
      });
      setSnackbarMessage('All Fields are Required');
      setVariant('warning');
      setSnackbarOpen(true);
    } else {
      if (!loading) {
        setLoading(true);
      }
      API.populateAssignments({ email, password, courseId })
        .then(res => {
          localStorage.setItem('courseDbId', res.data._id);
          setEmail('');
          setPassword('');
          setCourseId('');
          loadData(res.data._id);
          setCourseDbId(res.data._id);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setSnackbarMessage(
            `${err.response.statusText}: ${err.response.data.message ||
              err.response.data}`
          );
          setLoading(false);
          setVariant('error');
          setSnackbarOpen(true);
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
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        TransitionComponent={TransitionUp}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}>
        <SnackbarContentWrapper
          onClose={handleSnackbarClose}
          variant={variant}
          message={snackbarMessage}
        />
      </Snackbar>
      <Container maxWidth="lg">
        <Form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          courseId={courseId}
          setCourseId={setCourseId}
          error={error}
        />
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={populate}>
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
              variant="contained"
              color="secondary"
              disabled={deleteLoading}
              onClick={deleteAssignments}>
              Delete Course Data
            </Button>
          </CustomTooltip>
          {deleteLoading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
        <InactiveStudents
          courseDbId={courseDbId}
          assignments={assignments}
          inactiveStudents={inactiveStudents}
          loadData={loadData}
        />
        <FilteredAssignments
          courseDbId={courseDbId}
          assignments={assignments}
          filteredAssignments={filteredAssignments}
          loadData={loadData}
        />
        <Table tableData={tableData} />
      </Container>
    </div>
  );
}

export default App;
