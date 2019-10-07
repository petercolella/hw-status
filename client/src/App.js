import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { amber, blue, green, red } from '@material-ui/core/colors';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Form from './components/Form';
import InactiveStudents from './components/InactiveStudents';
import FilteredAssignments from './components/FilteredAssignments';
import MUIDataTable from 'mui-datatables';
import logo from './logo.svg';
import './App.css';
import API from './utils/API';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
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
  },
  table: {
    margin: theme.spacing(2)
  }
}));

const columns = [
  {
    name: 'assignmentTitle',
    label: 'Assignment Title',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'studentName',
    label: 'Student Name',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'submitted',
    label: 'Submitted',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'grade',
    label: 'Grade',
    options: {
      filter: true,
      sort: true,
      setCellProps: cellValue => {
        if (
          cellValue === 'Unsubmitted & Ungraded' ||
          cellValue === 'Incomplete'
        ) {
          return { style: { color: red['A400'] } };
        }

        if (cellValue === 'Ungraded') {
          return { style: { color: amber[700] } };
        }
      }
    }
  }
];

const options = {
  filterType: 'checkbox',
  responsive: 'scrollFullHeight',
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 15, 25, 50, 75, 100]
};

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

const MySnackbarContentWrapper = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant])}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
      ref={ref}
    />
  );
});

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
    const courseDbId = localStorage.getItem('courseDbId');
    if (courseDbId) {
      loadData(courseDbId);
      setCourseDbId(courseDbId);
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
      if (!loading) {
        setLoading(true);
      }
      API.deleteAssignments({ email, password, courseId })
        .then(res => {
          localStorage.setItem('courseDbId', res.data._id);
          setEmail('');
          setPassword('');
          setCourseId('');
          loadData(res.data._id);
          setCourseDbId(courseDbId);
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
          setCourseDbId(courseDbId);
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
        <MySnackbarContentWrapper
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
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={deleteAssignments}>
            Delete Course Data
          </Button>
          {loading && (
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
        <MUIDataTable
          className={classes.table}
          title={'Homework Status'}
          data={tableData}
          columns={columns}
          options={options}
        />
      </Container>
    </div>
  );
}

export default App;
