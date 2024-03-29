const numbers = /^[0-9]+$/;

export const valid = (data) => {
  const err = {};

  if (data.slipNumber_from && data.slipNumber_to && Number(data.slipNumber_to) <= Number(data.slipNumber_from)) {
    err.slipNumber = 'ID sau phải lớn hơn ID trước !';
  } else if ((data.slipNumber_from && !numbers.test(data.slipNumber_from)) || (data.slipNumber_to && !numbers.test(data.slipNumber_to))) {
    err.slipNumber = 'ID không hợp lệ  !';
  }

  if (data.slipDate_from && data.slipDate_to && data.slipDate_from >=data.slipDate_to) {
    err.slipDate = 'Ngày sau phải lớn hơn ngày trước !';
  }

  if(data.startDate && data.endDate && data.startDate >= data.endDate) {
    err.appDate = 'Ngày tháng năm sau phải lớn hơn !';
  }

  if ((data.departmentCode && !numbers.test(data.departmentCode))) {
    err.departmentCode = 'Mã không hợp lệ. Vui lòng nhập số !';
  }

  if ((data.KINGAKU && !numbers.test(data.KINGAKU))) {
    err.KINGAKU = 'Mã không hợp lệ. Vui lòng nhập số !';
  } else if (data.KINGAKU === '') {
    err.KINGAKU = 'Yêu cầu nhập !';
  }

  if (data.IDODT === '') {
    err.IDODT = 'Yêu cầu nhập !';
  }

  if (data.SHUPPATSUPLC === '' || (data.SHUPPATSUPLC && !data.SHUPPATSUPLC.trim())) {
    err.SHUPPATSUPLC = 'Yêu cầu nhập !';
  }

  if (data.MOKUTEKIPLC === '' || (data.MOKUTEKIPLC && !data.MOKUTEKIPLC.trim())) {
    err.MOKUTEKIPLC = 'Yêu cầu nhập !';
  }

  return {
    errMessage: err,
    errLength: Object.keys(err).length,
  }
}

export const validate = (name, value) => {
  let isError = '';
  if(name === 'KINGAKU' && (value && !numbers.test(value))) {
    isError = 'Mã không hợp lệ. Vui lòng nhập số !';
  } else {
    isError = (!value || value === '' || (value && !value.trim())) && 'Yêu cầu nhập !';
  }
  return isError;
}

