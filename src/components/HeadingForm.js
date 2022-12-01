import { useState } from "react";
import { Link } from "react-router-dom";
import { accountingMethods, API_URL_HEADING } from "../contance";
import { POST } from "../utils/apiHelper";
// import useFetch from "../utils/useFetch";
import { valid } from "../utils/valid";
import InputDatePicker from "./DatePicker";
import { years } from "../contance";

const HeadingForm = ({setData}) => {
  const [formData, setFormData] = useState({
    slipNumber_from: '',
    slipNumber_to: '',
    slipDate_from: '',
    slipDate_to: '',
    startDate: '',
    endDate: '',
    accountingMethod1: '',
    accountingMethod2: '',
  });

  // const {data} = useFetch(API_URL_HEADING, 'GET');
  // const dataTmp = data && data.map(item=> item.SUITOKB);
  // const accountingMethod = dataTmp && Array.from(new Set(dataTmp));

  const onChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const onChangeStartDate = (value) => {
    setFormData({
      ...formData,
      startDate: value,
    })
  }
  const onChangeEndDate = (value) => {
    setFormData({
      ...formData,
      endDate: value,
    })
  }
  const onChangeSlipDateFrom = (value) => {
    setFormData({
      ...formData,
      slipDate_from: value,
    })
  }
  const onChangeSlipDateTo = (value) => {
    setFormData({
      ...formData,
      slipDate_to: value,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {...formData};
    POST(API_URL_HEADING, data)
    .then(res=> res && res.data && setData(res.data))
    .catch(err => console.log(err));
  }
  const {errMessage} = valid(formData);
  const isValid = Object.keys(errMessage).length > 0;

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col-md-6 pb-5 d-flex">
            <label htmlFor="" className="label">年度</label>
            <select className="input-cus">
              {
                years.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div> 
        </div>

        <div className="row row-cus pb-4">
          <div className="col-md-4 d-flex">
            <label htmlFor="" className="label">伝票番号</label>
            <input type="text" className="input-cus" value={formData.slipNumber_from} onChange={onChange} name="slipNumber_from"/>
          </div>
          <div className="col-md-1">-</div>
          <div className="col-md-3">
            <input type="text" className="input-cus" value={formData.slipNumber_to} onChange={onChange} name="slipNumber_to"/>
          </div>
          {errMessage.slipNumber && <div className="col-md-4">
            <span className="text-danger">{errMessage.slipNumber}</span>
          </div>}
        </div>

        <div className="row row-cus pb-4">
          <div className="col-md-4 d-flex"> 
            <label htmlFor="" className="label">伝票日付</label>
            <InputDatePicker 
              value={formData.slipDate_from} 
              onChange={onChangeSlipDateFrom} 
              name="slipDate_from" 
              startDate={formData.slipDate_from}
              endDate = {formData.slipDate_to}
            />
          </div>
          <div className="col-md-1">-</div>
          <div className="col-md-3"> 
            <InputDatePicker 
              value={formData.slipDate_to} 
              onChange={onChangeSlipDateTo} 
              name="slipDate_to" 
              startDate={formData.slipDate_from}
              endDate = {formData.slipDate_to}
            />
          </div>
          {errMessage.slipDate && <div className="col-md-4">
            <span className="text-danger">{errMessage.slipDate}</span>
          </div>}
        </div>

        <div className="row row-cus pb-4">
          <div className="col-md-4 d-flex"> 
            <label htmlFor="" className="label">申請日</label>
            <InputDatePicker 
              value={formData.startDate} 
              onChange={onChangeStartDate} 
              name="startDate" 
              startDate={formData.startDate}
              endDate = {formData.endDate}
            />
          </div>
          <div className="col-md-1">-</div>
          <div className="col-md-3"> 
            <InputDatePicker 
              value={formData.endDate} 
              onChange={onChangeEndDate} 
              name="endDate"
              startDate={formData.startDate}
              endDate = {formData.endDate}
            />
          </div>
          {errMessage.appDate && <div className="col-md-4">
            <span className="text-danger">{errMessage.appDate}</span>
          </div>}
        </div>

        <div className="row row-cus pb-4">
          <div className="col-md-4 d-flex">
            <label htmlFor="" className="label">出納方法</label>
            <select className="input-cus" value={formData.accountingMethod1} onChange={onChange} name="accountingMethod1">
              <option value=""></option>
              {
                accountingMethods.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-1">-</div>
          <div className="col-md-6">
            <select className="input-cus" value={formData.accountingMethod2} onChange={onChange} name="accountingMethod2">
              <option value=""></option>
              {
                accountingMethods.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-10 pb-4"> 
            <button type="submit" className="btn btn-primary" disabled={isValid}>検索</button>
          </div>
          <div className="col-md-2 pb-4"> 
            <Link to='/scheduled' className="btn btn-primary" disabled={isValid}>登録</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default HeadingForm