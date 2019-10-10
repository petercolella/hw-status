import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 20,
    padding: theme.spacing(1)
  }
}))(Tooltip);

export default CustomTooltip;
