import { TableCell, TableRow, Collapse, IconButton, Box } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { JsonViewer } from '@textea/json-viewer';

import { formatISTTime } from '../../utils/time';

const CollapsibleRow = (props) => {
  const { log, isExpanded, onExpand } = props;

  return (
    <>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell>
          <IconButton
            onClick={onExpand.bind(null, log.id)}
            aria-label='expand row'
            size='small'
          >
            {isExpanded ? (
              <ArrowDropDownIcon
                sx={{
                  color: '#5c6d8e',
                  fontSize: 24,
                  cursor: 'pointer',
                }}
              />
            ) : (
              <ArrowRightIcon
                sx={{
                  color: '#c8d8ff',
                  fontSize: 24,
                  cursor: 'pointer',
                }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {formatISTTime(log.createdAt)}
        </TableCell>
        <TableCell component='th' scope='row'>
          {formatISTTime(log.timestamp)}
        </TableCell>
        <TableCell align='center'>{log.processingTime}</TableCell>
        <TableCell align='center'>{log.method}</TableCell>
        <TableCell align='center'>{log.remoteAddress}</TableCell>
        <TableCell align='left'>{log.url}</TableCell>
        <TableCell align='center'>{log.statusCode}</TableCell>
        <TableCell align='right'>{log.statusMessage}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding='none' colSpan={9}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <Box sx={{ padding: '25px' }}>
              <JsonViewer value={log} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
