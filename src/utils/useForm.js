import { useState, useEffect } from "react";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    if(Object.keys(errors).length === 0 && isSubmiting) {
      callback();
    }
  }, [errors, callback, isSubmiting]);

  const handleSubmit = (event) => {
    if(event) event.preventDefaut();
    setErrors(validate(values));
    setIsSubmiting(true);
  };

  const handleChange = (event) => {
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors
  }
};

export default useForm;