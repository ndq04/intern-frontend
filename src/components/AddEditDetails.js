import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { API_URL_UPDATE_DETAIL } from "../contance";
import { POST } from "../utils/apiHelper";
import { formatDate, getStorage, setStorage } from "../utils/common";
import { validate } from "../utils/valid";
import InputDatePicker from "./DatePicker";

const AddEditDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location.state && location.state.detail;
  const detailDB = location.state && location.state.detailDB;
  const item = location.state && location.state.item;

  const [state, setState] = useState({
    formData: {
      GYONO: Math.floor(Math.random() * 999999 + 1),
      IDODT: '',
      SHUPPATSUPLC : '',
      MOKUTEKIPLC: '',
      KEIRO: '',
      KINGAKU: '',
      CHECKDELETE: false,
    },
    detailStrg: [],
    errMsg: null,
    isError: {},
    isValid: false,
  });

  useEffect(() => {
    const {IDODT, SHUPPATSUPLC, MOKUTEKIPLC, KINGAKU} = state.formData;
    const isValid = Object.values(state.isError).some(item => item) || !IDODT || SHUPPATSUPLC === '' || MOKUTEKIPLC === '' || KINGAKU === '';
    setState(prevState => ({
      ...prevState,
      isValid
    }));

  }, [state.formData, state.isError])

  useEffect(() => {
    if(detail) {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          IDODT: new Date(detail.IDODT),
          SHUPPATSUPLC: detail.SHUPPATSUPLC,
          MOKUTEKIPLC: detail.MOKUTEKIPLC,
          KEIRO: detail.KEIRO,
          KINGAKU: detail.KINGAKU,
          // CHECKDELETE: detail.CHECKDELETE
        }
      }))
    }
    if(detailDB) {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          IDODT: new Date(detailDB.IDODT),
          SHUPPATSUPLC: detailDB.SHUPPATSUPLC,
          MOKUTEKIPLC: detailDB.MOKUTEKIPLC,
          KEIRO: detailDB.KEIRO,
          KINGAKU: detailDB.KINGAKU,
          // CHECKDELETE: detail.CHECKDELETE
        }
      }))
    }
  }, [detail, detailDB])

  useEffect(() => {
    const data = getStorage(`detail_${item.DENPYONO}`);
    if(data && data.length > 0) {
      setState(prevState => ({
        ...prevState,
        detailStrg: data,
      }));
    }
  }, [item.DENPYONO])

  useEffect(() => {
    setStorage({
      key: `detail_${item.DENPYONO}` ,
      val: state.detailStrg
    })
  }, [state.detailStrg, item.DENPYONO]);

  const onChangeDate = (value) => {
    const IDODT = !value ? 'Yêu cầu nhập !' : '';
    const isError = {...state.isError, IDODT };
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        IDODT: value,
      },
      isError
    }))
  }

  const onChange = e => {
    const {value, name, checked, type} = e.target;
    const data = type === 'checkbox' ? checked : value;
    const isError = name !== 'KEIRO' && {...state.isError, [name] : validate(name, value)};
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name] : data
      },
      isError
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {formData} = state;
  
    let data = {};
    if(detail) {
      data = {
        ...formData,
        SHUPPATSUPLC : formData.SHUPPATSUPLC.trim(),
        MOKUTEKIPLC: formData.MOKUTEKIPLC.trim(),
        KINGAKU: formData.KINGAKU,
        KEIRO: formData.KEIRO.trim(),
        GYONO: detail.GYONO,
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(formData.IDODT)
      }
      const detailStrgTmp = [...state.detailStrg];
      const findIndex = detailStrgTmp.findIndex(item => item && item.GYONO === data.GYONO);
      detailStrgTmp[findIndex] = data;
      setState(prevState => ({
        ...prevState,
        detailStrg: detailStrgTmp,
      }));
    } else if(detailDB) {
      data = {
        ...formData,
        SHUPPATSUPLC : formData.SHUPPATSUPLC.trim(),
        MOKUTEKIPLC: formData.MOKUTEKIPLC.trim(),
        KINGAKU: formData.KINGAKU,
        KEIRO: formData.KEIRO.trim(),
        GYONO: detailDB.GYONO,
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(formData.IDODT),
        CHECKDELETE: formData.CHECKDELETE
      }
      const datas = [{...data}];
      datas.forEach(async item => {
        await POST(API_URL_UPDATE_DETAIL, item);
      })
    } else {
      data = {
        ...formData,
        SHUPPATSUPLC : formData.SHUPPATSUPLC.trim(),
        MOKUTEKIPLC: formData.MOKUTEKIPLC.trim(),
        KINGAKU: formData.KINGAKU.trim(),
        KEIRO: formData.KEIRO.trim(),
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(formData.IDODT),
        CHECKDELETE: formData.CHECKDELETE
      }
      setState(prevState => ({
        ...prevState,
        detailStrg: [...prevState.detailStrg, data]
      }));
    }
    navigate(-1, {state: {test: state}});
  }
  const {isError} = state;
  return (
    <div>
      <h1 className='text-center my-5'>予定伝票入力</h1>
      <div className="container">
        <form>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">
                年月日
                <span className="required">*</span>
              </label>
              <InputDatePicker 
                value={state.formData.IDODT} 
                onChange={onChangeDate} 
                name="IDODT" 
                wrapperClassName = {isError && isError.IDODT ? 'react-datepicker__input-container error' : 'react-datepicker__input-container'}
              />
            </div>
            {isError && isError.IDODT && <div className="col-md-4">
            <span className="text-danger">{isError.IDODT}</span>
            </div>}
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">
                出発地
                <span className="required">*</span>
              </label>
              <input type="text" className={isError && isError.SHUPPATSUPLC ? "input-cus error" : "input-cus"} name="SHUPPATSUPLC" value={state.formData.SHUPPATSUPLC} onChange={onChange}/>
            </div>
            {isError && isError.SHUPPATSUPLC && <div className="col-md-4">
            <span className="text-danger">{isError.SHUPPATSUPLC}</span>
            </div>}
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">
                目的地
                <span className="required">*</span>
              </label>
              <input type="text" className={isError && isError.MOKUTEKIPLC ? "input-cus error" : "input-cus"} name="MOKUTEKIPLC" value={state.formData.MOKUTEKIPLC} onChange={onChange}/>
            </div>
            {isError && isError.MOKUTEKIPLC && <div className="col-md-4">
            <span className="text-danger">{isError.MOKUTEKIPLC}</span>
            </div>}
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">経路</label>
              <input type="text" className="input-cus" name="KEIRO" value={state.formData.KEIRO} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">
                金額
                <span className="required">*</span>
              </label>
              <input type="text" className={isError && isError.KINGAKU ? "input-cus error" : "input-cus"} name="KINGAKU" value={state.formData.KINGAKU} onChange={onChange}/>
            </div>
            {isError && isError.KINGAKU && <div className="col-md-4">
            <span className="text-danger">{isError.KINGAKU}</span>
            </div>}
          </div>
          
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="check-delete" className="label" style={{cursor: detail || detailDB ? 'pointer' : 'not-allowed', color: detail || detailDB ? '' : '#999'}}>削除</label>
              <input 
                className="form-check-input" 
                type="checkbox" value={state.formData.CHECKDELETE} 
                id="check-delete" style={{cursor: detail || detailDB ? 'pointer' : ''}} 
                name="CHECKDELETE" onChange={onChange}
                disabled={!detail && !detailDB}
                // checked={state.CHECKDELETE}
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-12" style={{display:'flex', justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleSubmit} disabled={state.isValid}>登録</button>
              <button onClick={() => navigate(-1)} type="button" className="btn btn-primary">終了</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditDetails