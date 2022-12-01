import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { formatDate, setStorage } from "../utils/common";
import InputDatePicker from "./DatePicker"

const AddEditDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location.state && location.state.detail;
  const item = location.state && location.state.item;
  const [detailStrg, setDetailStrg] = useState([]);

  const [state, setState] = useState({
    date: '',
    pointOfDeparture : '',
    destination: '',
    route: '',
    money: '',
    checkDelete: false
  });

  useEffect(() => {
    if(detail) {
      setState((prevState) => ({
        ...prevState,
        date: new Date(detail.IDODT),
        pointOfDeparture: detail.SHUPPATSUPLC,
        destination: detail.MOKUTEKIPLC,
        route: detail.KEIRO,
        money: detail.KINGAKU
      }))
    }
  }, [detail])

  useEffect(() => {
    setStorage({
      key: detailStrg,
      val: `detail_${item.DENPYONO}`
    })
  }, [detailStrg, item.DENPYONO]);

  const onChangeDate = (value) => {
    setState({
      ...state,
      date: value,
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
    const data = {
        ...state,
        slipNumber: item.DENPYONO,
        date: formatDate(state.date)
      }
    setDetailStrg(prev => ([...prev, data]));
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
                value={state.date} 
                onChange={onChangeDate} 
                name="date" 
              />
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">出発地</label>
              <input type="text" className="input-cus" name="pointOfDeparture" value={state.pointOfDeparture} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">目的地</label>
              <input type="text" className="input-cus" name="destination" value={state.destination} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">経路</label>
              <input type="text" className="input-cus" name="route" value={state.route} onChange={onChange}/>
            </div>
          </div>

          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="" className="label">金額</label>
              <input type="text" className="input-cus" name="money" value={state.money} onChange={onChange}/>
            </div>
          </div>
          
          <div className="row row-cus pb-4">
            <div className="col-md-4 d-flex"> 
              <label htmlFor="check-delete" className="label" style={{cursor:'pointer'}}>削除</label>
              <input className="form-check-input" type="checkbox" value={state.checkDelete} id="check-delete" style={{cursor:'pointer'}} name="checkDelete" onChange={onChange}/>
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