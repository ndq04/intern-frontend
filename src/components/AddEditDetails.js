import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { formatDate, getStorage, setStorage, useComponentDidUpdate } from "../utils/common";
import { valid } from "../utils/valid";
import InputDatePicker from "./DatePicker"

const AddEditDetails = () => {
  const hasMounted = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location.state && location.state.detail;
  const item = location.state && location.state.item;
  const [errMsg, setErrMsg] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [state, setState] = useState({
    formData: {
      GYONO: Math.floor(Math.random() * 999999 + 1),
      IDODT: '',
      SHUPPATSUPLC : '',
      MOKUTEKIPLC: '',
      KEIRO: '',
      KINGAKU: '',
      checkDelete: false,
    },
    detailStrg: [],
  });

  // useEffect(() => {
  //   const {errMessage} = valid(state);
  //   const isValid = Object.keys(errMessage).length > 0;
  //   setErrMsg(errMessage);
  //   setIsValid(isValid);
  // }, [state]);
  useEffect(() => {
    if( hasMounted.current) {
      console.log('do')
    } else {
      hasMounted.current = true;
    }
  })

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
          // checkDelete: detail.checkDelete
        }
      }))
    }
  }, [detail])

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
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        IDODT: value,
      }
    }))
  }

  const onChange = e => {
    const {value, name, checked, type} = e.target;
    const data = type === 'checkbox' ? checked : value;
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name] : data
      }
    }))
    // const {errMessage} = valid(state);
    // const isValid = Object.keys(errMessage).length > 0;
    // setErrMsg(errMessage);
    // setIsValid(isValid);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const {formData} = state;
    const {errMessage} = valid(state);
    const isValid = Object.keys(errMessage).length > 0;
    setErrMsg(errMessage);
    setIsValid(isValid);

    if(isValid) return;
    let data;
    if(detail) {
      data = {
        ...formData,
        SHUPPATSUPLC : formData.SHUPPATSUPLC.trim(),
        MOKUTEKIPLC: formData.MOKUTEKIPLC.trim(),
        KINGAKU: formData.KINGAKU.trim(),
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
    } else {
      data = {
        ...formData,
        SHUPPATSUPLC : formData.SHUPPATSUPLC.trim(),
        MOKUTEKIPLC: formData.MOKUTEKIPLC.trim(),
        KINGAKU: formData.KINGAKU.trim(),
        KEIRO: formData.KEIRO.trim(),
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(formData.IDODT)
      }
      setState(prevState => ({
        ...prevState,
        detailStrg: [...prevState.detailStrg, data]
      }));
    }
    navigate(-1);
  }

  return (
    <div>
      <h1 className='text-center my-5'>予定伝票入力</h1>
      <div className="container">
        <form>
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">年月日</label>
              <InputDatePicker 
                value={state.formData.IDODT} 
                onChange={onChangeDate} 
                name="IDODT" 
              />
            </div>
            {errMsg && errMsg.IDODT && <div className="col-md-4">
            <span className="text-danger">{errMsg.IDODT}</span>
            </div>}
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">出発地</label>
              <input type="text" className="input-cus" name="SHUPPATSUPLC" value={state.formData.SHUPPATSUPLC} onChange={onChange}/>
            </div>
            {errMsg && errMsg.SHUPPATSUPLC && <div className="col-md-4">
            <span className="text-danger">{errMsg.SHUPPATSUPLC}</span>
            </div>}
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">目的地</label>
              <input type="text" className="input-cus" name="MOKUTEKIPLC" value={state.formData.MOKUTEKIPLC} onChange={onChange}/>
            </div>
            {errMsg && errMsg.MOKUTEKIPLC && <div className="col-md-4">
            <span className="text-danger">{errMsg.MOKUTEKIPLC}</span>
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
              <label htmlFor="" className="label">金額</label>
              <input type="text" className="input-cus" name="KINGAKU" value={state.formData.KINGAKU} onChange={onChange}/>
            </div>
            {errMsg && errMsg.KINGAKU && <div className="col-md-4">
            <span className="text-danger">{errMsg.KINGAKU}</span>
            </div>}
          </div>
          
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="check-delete" className="label" style={{cursor: detail ? 'pointer' : 'not-allowed', color: detail ? '' : '#999'}}>削除</label>
              <input 
                className="form-check-input" 
                type="checkbox" value={state.formData.checkDelete} 
                id="check-delete" style={{cursor: detail ? 'pointer' : ''}} 
                name="checkDelete" onChange={onChange}
                disabled={!detail}
                // checked={state.checkDelete}
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-12" style={{display:'flex', justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-primary" style={{marginRight: 10}} onClick={handleSubmit}>登録</button>
              <button onClick={() => navigate(-1)} type="button" className="btn btn-primary">終了</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditDetails