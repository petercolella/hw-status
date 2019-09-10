import React, { useState, useEffect } from 'react';
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
  }
}));

function App() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    API.getAssignments().then(res => {
      res.data.forEach(assignment => {
        assignment['submitted'] =
          assignment['submitted'] === true ? '\u{2705}' : '';
      });
      setTableData(res.data);
    });
  }, []);

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
        sort: true
      }
    }
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'scrollFullHeight'
  };

  const populate = () => {
    API.populateAssignments({ email, password, courseId }).then(res => {
      res.data.forEach(assignment => {
        assignment['submitted'] =
          assignment['submitted'] === true ? '\u{2705}' : '';
      });
      setTableData(res.data);
      setEmail('');
      setPassword('');
      setCourseId('');
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Container maxWidth="lg">
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={e => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            id="courseId"
            label="Course ID"
            className={classes.textField}
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
        <MUIDataTable
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
