import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Form from './components/Form';
import Button from '@material-ui/core/Button';
import InactiveStudents from './components/InactiveStudents';
import FilteredAssignments from './components/FilteredAssignments';
import MUIDataTable from 'mui-datatables';
import logo from './logo.svg';
import './App.css';
import API from './utils/API';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
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
          return { style: { color: '#f50057' } };
        }

        if (cellValue === 'Ungraded') {
          return { style: { color: '#ffab00' } };
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

function App() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseDbId, setCourseDbId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [tableData, setTableData] = useState([]);

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

  const populate = () => {
    API.populateAssignments({ email, password, courseId })
      .then(res => {
        localStorage.setItem('courseDbId', res.data._id);
        setEmail('');
        setPassword('');
        setCourseId('');
        loadData(res.data._id);
        setCourseDbId(courseDbId);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Container maxWidth="lg">
        <Form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          courseId={courseId}
          setCourseId={setCourseId}
        />
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
