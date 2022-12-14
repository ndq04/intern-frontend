import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  API_URL_ADD_DETAIL, 
  API_URL_ADD_SCHEDULED, 
  API_URL_DELETE_SCHEDULED, 
  API_URL_DEPARTMENT, 
  API_URL_DETAIL, 
  API_URL_UPDATE_SCHEDULED 
} from "../contance";
import { GET, POST } from "../utils/apiHelper";
import { formatDate, getStorage, removeStorage } from "../utils/common";
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
  const dataStorage = item && getStorage(`detail_${item.DENPYONO}`);
  const [state, setState] = useState({
    formData : {
      slipNumber: '',
      slipDate: formatDate(new Date()),
      accountingMethod: '',
      paymentDueDate: '',
      year: 2022,
      applicationDateDate: '',
      departmentCode: '',
      departmentName: '',
      comment: ''
    },
    errMessage: null,
    isValid: false,
    departmentErr: null,
    departments: [],
    showDepartmentPopup: false,
    showSuccess: false,
    showError: false,
    showDelete: false,
    isDel: false,
    id: null,
    details: [],
    selectDepartment: '',
  });

  const handleShow = () => setState(prevState => ({
    ...prevState,
    showDepartmentPopup: true,
  }));
  const handleClose = () => {
    // if(!item) {
    setState((prevState)=>({
      ...prevState,
      formData : {
        ...prevState.formData,
        departmentCode: '',
        departmentName: '',
      },
      showDepartmentPopup: false,
      selectDepartment: '',
    }));
    // }
    GET(API_URL_DEPARTMENT)
      .then(res => res && res.data &&
        setState(prevState => ({
          ...prevState,
          departments: res.data
        }))
      )
      .catch(err => console.log(err));
  };
  const show = () => setState(prevState => ({
    ...prevState,
    showSuccess: true,
  }));
  const hide = () => {
    setState(prevState => ({
      ...prevState,
      formData: {
        slipNumber: '',
        slipDate: formatDate(new Date()),
        accountingMethod: '',
        paymentDueDate: '',
        year: 2022,
        applicationDateDate: '',
        departmentCode: '',
        departmentName: '',
        comment: ''
      },
      showSuccess: false,
    }))
    navigate('/');
  };

  const handleShowError = () => setState(prevState => ({
    ...prevState,
    showError: true,
  }));

  const handleHideError = () => setState(prevState => ({
    ...prevState,
    showError: false,
  }));

  const handleShowDel = () => setState(prevState => ({
    ...prevState,
    showDelete: true,
  }));
  
  const handleHideDel = async () => {
    const id = item && item.DENPYONO;
    const res =  await POST(API_URL_DELETE_SCHEDULED, {id});
    if(res.status === 200) {
      show();
      setState(prevState => ({
        ...prevState,
        showDelete: false,
      }));
    }
  };

  useEffect(() => {
    if(item) {
      setState((prevState)=>({
        ...prevState,
        formData: {
          ...prevState.formData,
          slipNumber: item.DENPYONO,
          slipDate: formatDate(item.DENPYODT),
          accountingMethod: item.SUITOKB,
          paymentDueDate: new Date(item.SHIHARAIDT),
          applicationDateDate: new Date(item.UKETUKEDT),
          departmentCode: item.BUMONCD_YKANR,
          departmentName: item.BUMONNM,
          comment: item.BIKO,
        }
      }));
    }
  }, [item]);

  useEffect(() => {
    const {errMessage} = valid(state.formData);
    const isValid = Object.keys(errMessage).length > 0 || state.departmentErr ;
    setState(prevState => ({
      ...prevState,
      errMessage
    }));
    setState(prevState => ({
      ...prevState,
      isValid
    }));
  },[state.formData, state.departmentErr]);

  useEffect(() => {
    GET(API_URL_DEPARTMENT)
      .then(res => res && res.data && 
        setState(prevState => ({
          ...prevState,
          departments: res.data,
        }))
      )
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if(item) {
      GET(API_URL_DETAIL, {id: item.DENPYONO})
      .then(res => res && res.data && 
        setState(prevState => ({
          ...prevState,
          details: res.data,
        }))
      )
      .catch(err => console.log(err));
    }
  }, [item]);

  useEffect(() => {
    if(item) {
      setState(prevState => ({
        ...prevState,
        selectDepartment: item.BUMONCD_YKANR,
      }))
    }
  }, [item]);

  const amounts = state.details.length > 0 && state.details.map(item => item.KINGAKU);
  const amounts1 = dataStorage && dataStorage.map(item => Number(item.KINGAKU));

  const moneys = amounts && amounts.reduce((a, b) => a + b, 0);
  const moneys1 = amounts1 && amounts1.reduce((a, b) => a + b, 0);

  const sums = moneys + moneys1;

  const onChange = (e) =>{
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      formData : {
        ...prevState.formData,
        [name]: value,
      }
    }));
    if(name === 'departmentCode') {
      if(!value || value === '') {
        setState((prevState) => ({
          ...prevState,
          formData : {
            ...prevState.formData,
            departmentName: '',
          },
          departmentErr: 'Tr?????ng b???t bu???c nh???p',
        }));
      } else {
        const findItem = state.departments.find(item => item.BUMONCD === value);
        if(findItem) {
          setState(prevState => ({
            ...prevState,
            formData: {
              ...prevState.formData,
              [name]: value,
              departmentName: findItem.BUMONNM,
            },
            departmentErr: null,
            selectDepartment: value,
          }));
        } else {
          setState(prevState => ({
            ...prevState,
            formData: {
              ...prevState.formData, 
              [name]: value,
              departmentName: '',
            },
            departmentErr: 'Tr?????ng b???t bu???c nh???p',
          }));
        }
      }
    }
  }
  const onChangePaymentDueDate = (value) => {
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        paymentDueDate: value,
      }
    }))
  }
  const onChangeApplicationDateDate = (value) => {
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        applicationDateDate: value,
      }
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const checkValid = !!state.formData.accountingMethod && !!state.formData.paymentDueDate && !!state.formData.applicationDateDate && !!state.formData.departmentCode;
      if(!checkValid) {
        handleShowError();
        return;
      }
      const data = {...state.formData};
      if(dataStorage) {
        const dataDetail = [...dataStorage].filter(item => item && !item.checkDelete);
        if(dataDetail.length > 0) {
          await POST(API_URL_ADD_DETAIL, dataDetail);
          // removeStorage(`detail_${item.DENPYONO}`);
        }
      }
      const res = item ? await POST(API_URL_UPDATE_SCHEDULED, data) : await POST(API_URL_ADD_SCHEDULED, data);
      if(res && res.status === 200) {
          const {insertId} = res.data.result;
          const id = item ? item.DENPYONO : insertId;
          setState(prevState => ({
            ...prevState,
            id
          }));
          show();
        }
    } catch (error) {
      console.log(error);
    }
  }
  const handleConfirmDelete = (e) => {
    const id = item && item.DENPYONO;
    setState(prevState => ({
      ...prevState,
      isDel: true,
      id,
    }));
    handleShowDel();
  }

  const onChangeSelectDepartment = (value) => {
    setState(prevState => ({
      ...prevState,
      selectDepartment: value,
    }));
  }

  return (
    <div>
      <h1 className='text-center my-5'>??????????????????</h1>
      <div className="container">
        <form>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">????????????</label>
              <input disabled type="text" className="input-disabled" value={state.formData.slipNumber} name="slipNumber"/>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleSubmit} disabled={state.isValid}>??????</button>
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleConfirmDelete} disabled={!item}>??????</button>
              <button onClick={() => navigate(-1) } type="button" className="btn btn-primary">??????</button>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">????????????</label>
              <input disabled type="text" className="input-disabled" value={state.formData.slipDate} name="slipDate"/>
            </div>
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">????????????</label>
              <select className="input-cus" value={state.formData.accountingMethod} onChange={onChange} name="accountingMethod">
                <option value=''></option>
                {
                  accountingMethods.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))
                }
              </select>
            </div>
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">???????????????</label>
              <InputDatePicker 
                value={state.formData.paymentDueDate} 
                onChange={onChangePaymentDueDate} 
                name="paymentDueDate" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex">
              <label htmlFor="" className="label">??????</label>
              <select className="input-cus" value={state.formData.year} onChange={onChange} name="year">
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
              <label htmlFor="" className="label">?????????</label>
              <InputDatePicker 
                value={state.formData.applicationDateDate} 
                onChange={onChangeApplicationDateDate} 
                name="applicationDateDate" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-12 d-flex" style={{alignItems: 'center'}}>
              <label htmlFor="" className="label">????????????</label>
              <input type="text" className="input-cus" value={state.formData.departmentCode} onChange={onChange} name="departmentCode" style={{marginRight:10}}/>
              <input disabled type="text" className="input-disabled" value={state.formData.departmentName} style={{marginRight:10}}/>
              <button type="button" className="btn btn-primary" onClick={handleShow}>???</button>
              {state.errMessage && state.errMessage.departmentCode && <div style={{marginLeft:10}}>
                <span className="text-danger">{state.errMessage.departmentCode}</span>
              </div>}
              {state.departmentErr && <div style={{marginLeft:10}}>
                <span className="text-danger">{state.departmentErr}</span>
              </div>}
            </div>
          </div>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex" style={{alignItems:'center'}}>
              <label htmlFor="" className="label">???????????? 
                <br />
                (??????)
              </label>
              <input type="text" className="input-cus" value={state.formData.comment} onChange={onChange} name="comment"/>
            </div>
            <div className="col-md-8" style={{display:'flex', justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-primary" disabled={!item} onClick={() => navigate('/details', {state: {item}})}>????????????</button>
            </div>
          </div>
        </form>
        <div className="heading">?????????</div>
        <div className="panel-body">
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">???</span></th>
                {/* {item && details.length > 0 && <th className="is-center"><span className="mb0 nowrap ct-custom bbw">????????????</span></th>} */}
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">?????????</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">?????????</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">?????????</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">??????</span></th>
                <th className="is-center"><span className="mb0 nowrap ct-custom bbw">??????</span></th>
              </tr>
            </thead>
            <tbody>
              {
                state.details.length > 0 && state.details.map((detail, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={{pathname : '/details', hash: `${detail.GYONO}`, }} state={{detail, item}}>{index + 1}</Link>
                    </td>
                    {/* {item && details.length > 0 &&
                    <td>
                      <span>{detail.DENPYONO}</span>
                    </td>} */}
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
              {
                dataStorage && dataStorage.length > 0 && dataStorage.map((detail, index) => (
                  <tr key={index} style={{background : detail.checkDelete ? '#8f9092' : '', opacity: detail.checkDelete ? '0.8' : ''}}>
                    <td>
                    <Link to={{pathname : '/details', hash: `${detail.GYONO}`, }} state={{detail, item}}>{index + 1}</Link>
                    </td>
                    {/* {item && details.length > 0 &&
                    <td>
                      <span>{detail.DENPYONO}</span>
                    </td>} */}
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
                  {/* {item && details.length > 0 && <td></td>} */}
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>????????????</td>
                  <td>{sums}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModalDepartment 
        onChange={onChangeSelectDepartment}
        close = {handleClose}
        parentState = {state}
        setParentState = {setState}
      />
      <ModalSuccess show={state.showSuccess} hide={hide} id={state.id} item={item} isDel={state.isDel}/>
      <ModalError show={state.showError} hide={handleHideError} item={item}/>
      <ModalDelete show={state.showDelete} hide={handleHideDel} id={state.id} setShowDelete={setState}/>
    </div>
  )
}

export default AddEditScheduled