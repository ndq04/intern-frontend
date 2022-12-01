
export const valid = (data) => {
  const err = {};
  const numbers = /^[0-9]+$/;

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

  // if(!data.accountingMethod) {
  //   err.accountingMethod = 'Trường bắt buộc !'
  // }

  return {
    errMessage: err,
    errLength: Object.keys(err).length,
  }
}