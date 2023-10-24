import { DateRangePicker } from 'react-date-range';

const TimeFilter = (props) => {
  const { selectionRange, onSelection } = props;

  return (
    <DateRangePicker
      className='date-range-picker'
      ranges={[selectionRange]}
      onChange={onSelection}
    />
  );
};

export default TimeFilter;
