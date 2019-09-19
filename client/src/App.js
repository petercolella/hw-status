import React, { useState, useEffect } from 'react';
import InactiveStudents from './components/InactiveStudents';
import FilteredAssignments from './components/FilteredAssignments';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MUIDataTable from 'mui-datatables';
import logo from './logo.svg';
import './App.css';
import API from './utils/API';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 200
  },
  button: {
    margin: theme.spacing(2)
  },
  table: {
    margin: theme.spacing(2)
  }
}));

function App() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseDbId, setCourseDbId] = useState('');
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tableData, setTableData] = useState([]);

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
          if (cellValue === 'Ungraded') {
            return { style: { color: '#f50057' } };
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

  const loadData = id => {
    API.getCourse(id)
      .then(res => {
        if (res.data) {
          const filteredTableData = res.data.assignments
            .map(assignment => {
              assignment['submitted'] =
                assignment['submitted'] === true ? '\u{2705}' : '\u274C';
              return { ...assignment, submitted: assignment['submitted'] };
            })
            .map(assignment => {
              assignment['grade'] =
                assignment['submitted'] === '\u{2705}' &&
                assignment['grade'] === null
                  ? 'Ungraded'
                  : assignment['submitted'] === '\u274C' &&
                    assignment['grade'] === null
                  ? 'Unsubmitted & Ungraded'
                  : assignment['grade'];
              return { ...assignment, grade: assignment['grade'] };
            })
            .filter(
              assignment =>
                !res.data.nonStudents.includes(assignment['studentName'])
            )
            .filter(
              assignment =>
                !res.data.filteredAssignments.includes(
                  assignment['assignmentTitle']
                )
            );

          setAssignments(res.data.assignments);
          setTableData(filteredTableData);
          setInactiveStudents(res.data.nonStudents);
          setFilteredAssignments(res.data.filteredAssignments);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const courseDbId = localStorage.getItem('courseDbId');
    if (courseDbId) {
      loadData(courseDbId);
      setCourseDbId(courseDbId);
    }
  }, []);

  const populate = () => {
    API.populateAssignments({ email, password, courseId })
      .then(res => {
        localStorage.setItem('courseDbId', res.data._id);
        setEmail('');
        setPassword('');
        setCourseId('');
        setCourseDbId(courseDbId);
        setInactiveStudents(res.data.nonStudents);
        setFilteredAssignments(res.data.filteredAssignments);
        loadData(res.data._id);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Container maxWidth="lg">
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            autoComplete="username"
            className={classes.textField}
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            autoComplete="current-password"
            className={classes.textField}
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            className={classes.textField}
            id="courseId"
            label="Course ID"
            type="number"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            margin="normal"
          />
        </form>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={populate}>
          Submit
        </Button>
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
