import { DateRangePicker } from 'react-date-range';

const TimeFilter = (props) => {
  const { selectionRange, onSelection } = props;

  return <DateRangePicker ranges={[selectionRange]} onChange={onSelection} />;
};

export default TimeFilter;
