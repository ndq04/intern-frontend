import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { formatDate, getStorage, setStorage } from "../utils/common";
import InputDatePicker from "./DatePicker"

const AddEditDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location.state && location.state.detail;
  const item = location.state && location.state.item;
  const [detailStrg, setDetailStrg] = useState([]);

  const [state, setState] = useState({
    GYONO: Math.floor(Math.random() * 999999 + 1),
    IDODT: '',
    SHUPPATSUPLC : '',
    MOKUTEKIPLC: '',
    KEIRO: '',
    KINGAKU: '',
    checkDelete: false
  });
  
  useEffect(() => {
    if(detail) {
      setState((prevState) => ({
        ...prevState,
        IDODT: new Date(detail.IDODT),
        SHUPPATSUPLC: detail.SHUPPATSUPLC,
        MOKUTEKIPLC: detail.MOKUTEKIPLC,
        KEIRO: detail.KEIRO,
        KINGAKU: detail.KINGAKU,
        // checkDelete: detail.checkDelete
      }))
    }
  }, [detail])

  useEffect(() => {
    const data = getStorage(`detail_${item.DENPYONO}`);
    if(data && data.length > 0) {
      setDetailStrg(data)
    }
  }, [item.DENPYONO])

  useEffect(() => {
    setStorage({
      key: `detail_${item.DENPYONO}` ,
      val: detailStrg
    })
  }, [detailStrg, item.DENPYONO]);

  const onChangeDate = (value) => {
    setState({
      ...state,
      IDODT: value,
    })
  }

  const onChange = e => {
    const {value, name, checked, type} = e.target;
    const data = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      [name] : data
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let data;
    if(detail) {
      data = {
        ...state,
        GYONO: detail.GYONO,
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(state.IDODT)
      }
      const detailStrgTmp = [...detailStrg];
      const findIndex = detailStrgTmp.findIndex(item => item && item.GYONO === data.GYONO);
      detailStrgTmp[findIndex] = data;
      setDetailStrg(detailStrgTmp);
    } else {
      data = {
        ...state,
        DENPYONO: item.DENPYONO,
        IDODT: formatDate(state.IDODT)
      }
      setDetailStrg(prev => ([...prev, data]));
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
                value={state.IDODT} 
                onChange={onChangeDate} 
                name="IDODT" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">出発地</label>
              <input type="text" className="input-cus" name="SHUPPATSUPLC" value={state.SHUPPATSUPLC} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">目的地</label>
              <input type="text" className="input-cus" name="MOKUTEKIPLC" value={state.MOKUTEKIPLC} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">経路</label>
              <input type="text" className="input-cus" name="KEIRO" value={state.KEIRO} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">金額</label>
              <input type="text" className="input-cus" name="KINGAKU" value={state.KINGAKU} onChange={onChange}/>
            </div>
          </div>
          
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="check-delete" className="label" style={{cursor: detail ? 'pointer' : 'not-allowed', color: detail ? '' : '#999'}}>削除</label>
              <input 
                className="form-check-input" 
                type="checkbox" value={state.checkDelete} 
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