import React from 'react';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper';

const SlideTransition = props => {
  return <Slide {...props} direction="down" />;
};

const SnackbarComponent = props => {
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setSnackbarOpen(false);
    setTimeout(
      () =>
        props.setError({
          email: false,
          password: false,
          courseId: false
        }),
      2000
    );
  };

  return (
    <Snackbar
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      TransitionComponent={SlideTransition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      open={props.snackbarOpen}>
      <SnackbarContentWrapper
        message={props.snackbarMessage}
        onClose={handleSnackbarClose}
        variant={props.variant}
      />
    </Snackbar>
  );
};

export default SnackbarComponent;
