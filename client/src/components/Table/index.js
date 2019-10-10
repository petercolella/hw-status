import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { amber, red } from '@material-ui/core/colors';
import MUIDataTable from 'mui-datatables';

const useStyles = makeStyles(theme => ({
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

const Table = props => {
  const classes = useStyles();

  return (
    <MUIDataTable
      className={classes.table}
      title={'Homework Status'}
      data={props.tableData}
      columns={columns}
      options={options}
    />
  );
};

export default Table;
