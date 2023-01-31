import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const InputDatePicker = ({value, name, onChange, startDate, endDate, wrapperClassName}) => {
  // const today = new Date();
  return (
    <DatePicker
      dateFormat="yyyy/MM/dd"
      selected={value}
      onChange={onChange} 
      // minDate={today}
      name={name}
      todayButton={"Today"}
      startDate={startDate}
      endDate={endDate}
      wrapperClassName = {wrapperClassName}
    />
  )
}

export default InputDatePicker;