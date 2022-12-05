import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_URL_ADD_SCHEDULED, API_URL_DELETE_SCHEDULED, API_URL_DEPARTMENT, API_URL_DETAIL, API_URL_UPDATE_SCHEDULED } from "../contance";
import { GET, POST } from "../utils/apiHelper";
import { formatDate } from "../utils/common";
import { valid } from "../utils/valid";
import InputDatePicker from "./DatePicker";
import { accountingMethods, years } from "../contance";
import { useEffect } from "react";
import ModalDepartment from "./ModalDepartment";
import ModalSuccess from "./ModalSuccess";
import ModalError from "./ModalError";
import ModalDelete from "./ModalDelete";

const AddEditScheduled = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state && location.state.item;

  const [formData, setFormData] = useState({
    slipNumber: '',
    slipDate: formatDate(new Date()),
    accountingMethod: '',
    paymentDueDate: '',
    year: 2022,
    applicationDateDate: '',
    departmentCode: '',
    departmentName: '',
    comment: ''
  });
  
  const [errMessage, setErrMessage] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [departmentErr, setDepartmentErr] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDel, setIsDel] = useState(false);
  const [id, setId] = useState('');
  const [details, setDetails] = useState([]);

  const [selectDepartment, setSelectDepartment] = useState('');
  const handleShow = () => setShowDepartmentPopup(true);
  const handleClose = () => {
    setShowDepartmentPopup(false);
    setSelectDepartment('');
    // if(!item) {
    setFormData((formData)=>({
      ...formData,
      departmentCode: '',
      departmentName: '',
    }));
    // }
    GET(API_URL_DEPARTMENT)
      .then(res => res && res.data && setDepartments(res.data))
      .catch(err => console.log(err));
  };
  const show = () => setShowSuccess(true);
  const hide = () => {
    setFormData({
      slipNumber: '',
      slipDate: formatDate(new Date()),
      accountingMethod: '',
      paymentDueDate: '',
      year: 2022,
      applicationDateDate: '',
      departmentCode: '',
      departmentName: '',
      comment: ''
    })
    setShowSuccess(false);
    navigate('/');
  };

  const handleShowError = () => setShowError(true);
  const handleHideError = () => setShowError(false);

  const handleShowDel = () => setShowDelete(true);
  const handleHideDel = async () => {
    const id = item && item.DENPYONO;
    const res =  await POST(API_URL_DELETE_SCHEDULED, {id});
    if(res.status === 200) {
      show();
      setShowDelete(false);
    }
  };

  useEffect(() => {
    if(item) {
      setFormData((formData)=>({
        ...formData,
        slipNumber: item.DENPYONO,
        slipDate: formatDate(item.DENPYODT),
        accountingMethod: item.SUITOKB,
        paymentDueDate: new Date(item.SHIHARAIDT),
        applicationDateDate: new Date(item.UKETUKEDT),
        departmentCode: item.BUMONCD_YKANR,
        departmentName: item.BUMONNM,
        comment: item.BIKO,
      }));
    }
  }, [item]);

  useEffect(() => {
    const {errMessage} = valid(formData);
    const isValid = Object.keys(errMessage).length > 0 || departmentErr ;
    setErrMessage(errMessage);
    setIsValid(isValid);
  },[formData, departmentErr]);

  useEffect(() => {
    GET(API_URL_DEPARTMENT)
      .then(res => res && res.data && setDepartments(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if(item) {
      GET(API_URL_DETAIL, {id: item.DENPYONO})
      .then(res => res && res.data && setDetails(res.data))
      .catch(err => console.log(err));
    }
  }, [item]);

  useEffect(() => {
    if(item) {
      setSelectDepartment(item.BUMONCD_YKANR);
    }
  }, [item])

  const amounts = details && details.map(item => item.KINGAKU);
  const moneys = amounts && amounts.reduce((a, b) => a + b, 0);

  const onChange = (e) =>{
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(name === 'departmentCode') {
      if(!value || value === '') {
        setFormData((formData) => ({
          ...formData,
          departmentName: '',
        }));
        setDepartmentErr('Trường bắt buộc nhập');
      } else {
        const findItem = departments.find(item => item.BUMONCD === value);
        if(findItem) {
          setFormData({
            ...formData,
            [name]: value,
            departmentName: findItem.BUMONNM,
          });
          setSelectDepartment(value);
          setDepartmentErr(null);
        } else {
          setFormData({
            ...formData,
            [name]: value,
            departmentName: '',
          });
          setDepartmentErr('Trường bắt buộc nhập');
        }
      }
    }
  }
  const onChangePaymentDueDate = (value) => {
    setFormData({
      ...formData,
      paymentDueDate: value,
    })
  }
  const onChangeApplicationDateDate = (value) => {
    setFormData({
      ...formData,
      applicationDateDate: value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkValid = !!formData.accountingMethod && !!formData.paymentDueDate && !!formData.applicationDateDate && !!formData.departmentCode;
    if(!checkValid) {
      handleShowError();
      return;
    }
    const data = {...formData};
    try {
      const res = item ? await POST(API_URL_UPDATE_SCHEDULED, data) : await POST(API_URL_ADD_SCHEDULED, data);
      if(res && res.status === 200) {
        const {insertId} = res.data.result;
        const id = item ? item.DENPYONO : insertId;
        setId(id);
        show();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleConfirmDelete = (e) => {
    setIsDel(true);
    const id = item && item.DENPYONO;
    setId(id);
    handleShowDel();
  }

  const onChangeSelectDepartment = (value) => {
    setSelectDepartment(value);
  }

  return (
    <div>
      <h1 className='text-center my-5'>予定伝票入力</h1>
      <div className="container">
        <form>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">伝票番号</label>
              <input disabled type="text" className="input-disabled" value={formData.slipNumber} name="slipNumber"/>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleSubmit} disabled={isValid}>登録</button>
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleConfirmDelete} disabled={!item}>削除</button>
              <button onClick={() => navigate(-1) } type="button" className="btn btn-primary">終了</button>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">伝票日付</label>
              <input disabled type="text" className="input-disabled" value={formData.slipDate} name="slipDate"/>
            </div>
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">出納方法</label>
              <select className="input-cus" value={formData.accountingMethod} onChange={onChange} name="accountingMethod">
                <option value=''></option>
                {
                  accountingMethods.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))
                }
              </select>
            </div>
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">支払予定日</label>
              <InputDatePicker 
                value={formData.paymentDueDate} 
                onChange={onChangePaymentDueDate} 
                name="paymentDueDate" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">年度</label>
              <select className="input-cus" value={formData.year} onChange={onChange} name="year">
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
              <label htmlFor="" className="label">申請日</label>
              <InputDatePicker 
                value={formData.applicationDateDate} 
                onChange={onChangeApplicationDateDate} 
                name="applicationDateDate" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-12 d-flex" style={{alignItems: 'center'}}>
              <label htmlFor="" className="label">起票部門</label>
              <input type="text" className="input-cus" value={formData.departmentCode} onChange={onChange} name="departmentCode" style={{marginRight:10}}/>
              <input disabled type="text" className="input-disabled" value={formData.departmentName} style={{marginRight:10}}/>
              <button type="button" className="btn btn-primary" onClick={handleShow}>ガ</button>
              {errMessage && errMessage.departmentCode && <div style={{marginLeft:10}}>
                <span className="text-danger">{errMessage.departmentCode}</span>
              </div>}
              {departmentErr && <div style={{marginLeft:10}}>
                <span className="text-danger">{departmentErr}</span>
              </div>}
            </div>
          </div>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex" style={{alignItems:'center'}}>
              <label htmlFor="" className="label">出張目的 
                <br />
                (備考)
              </label>
              <input type="text" className="input-cus" value={formData.comment} onChange={onChange} name="comment"/>
            </div>
            <div className="col-md-8" style={{display:'flex', justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-primary" disabled={!item} onClick={() => navigate('/details', {state: {item}})}>明細追加</button>
            </div>
          </div>
        </form>
        <div className="heading">交通費</div>
        <div className="panel-body">
          <table className="table table-bordered">
            <thead className="table-secondary">
              <tr>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">行</span></th>
                {item && details.length >0 && <th className="is-center"><span className="mb0 nowrap ct-custom bbw">伝票番号</span></th>}
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">年月日</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">出発地</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">目的地</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">経路</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">金額</span></th>
              </tr>
            </thead>
            <tbody>
              {
                details && details.length > 0 && details.map((detail, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={{pathname : '/details', hash: `${detail.GYONO}`, }} state={{detail, item}}>{index + 1}</Link>
                    </td>
                    {item && details.length > 0 &&
                    <td>
                      <span>{detail.DENPYONO}</span>
                    </td>}
                    <td>
                      <span>{detail.IDODT}</span>
                    </td>
                    <td>
                      <span>{detail.SHUPPATSUPLC}</span>
                    </td>
                    <td>
                      <span>{detail.MOKUTEKIPLC}</span>
                    </td>
                    <td>
                      <span>{detail.KEIRO}</span>
                    </td>
                    <td>
                      <span>{detail.KINGAKU}</span>
                    </td>
                  </tr>
                )) 
              }
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>交通費計</td>
                  <td>{moneys}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModalDepartment 
        onChange={onChangeSelectDepartment}
        selectDepartment = {selectDepartment}
        setSelectDepartment = {setSelectDepartment}
        departments = {departments}
        setDepartments = {setDepartments}
        showDepartmentPopup = {showDepartmentPopup}
        close = {handleClose}
        setFormData = {setFormData}
        setDepartmentErr = {setDepartmentErr}
      />
      <ModalSuccess show={showSuccess} hide={hide} id={id} setId={setId} item={item} isDel={isDel}/>
      <ModalError show={showError} hide={handleHideError} item={item}/>
      <ModalDelete show={showDelete} hide={handleHideDel} id={id} setShowDelete={setShowDelete}/>
    </div>
  )
}

export default AddEditScheduled