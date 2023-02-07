import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL_DELETE_SCHEDULED } from "../contance";
import { POST } from "../utils/apiHelper";
import { formatDate } from "../utils/common";
import ModalDelete from "./ModalDelete";
import ModalDeleteMulti from "./ModalDeleteMulti";
import ModalSuccess from "./ModalSuccess";
import ModalSuccessMulti from "./ModalSuccessMulti";
const HeadingResult = ({ data }) => {
  const amounts = data && data.map(item => item.KINGAKU);
  const moneys = amounts && amounts.reduce((a, b) => a + b, 0);
  const navigate = useNavigate();

  const [state, setState] = useState({
    item: {},
    showDelete: false, 
    showDeleteMulti: false,
    showSuccess: false,
    showSuccessMulti: false,
    isChecked: false,
    ids: [],
  })
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const listData = data && data.map(item => ({
      ...item,
      isChecked: false
    }));
    setLists(listData);
  }, [data]);
  
  const handleRedirect = (item) => {
    navigate({pathname: '/scheduled', hash: `${item.DENPYONO}`}, {state:{item}});
  }

  const handleChecked = (id) => {
    let newLists = [...lists];
    newLists = newLists.map(item => item.DENPYONO === id ? ({
      ...item,
      isChecked: !item.isChecked
    }) : item) 
    
    setLists(newLists);
  }

  const handleCheckedMulti = () => {
    let newLists = [...lists];
    newLists = newLists.map(item => ({
      ...item,
      isChecked: true
    }))
    setLists(newLists);
    setState(prevState => ({
      ...prevState,
      isChecked: !prevState.isChecked
    }));
  }

  const handleUnCheckedMulti = () => {
    let newLists = [...lists];
    newLists = newLists.map(item => ({
      ...item,
      isChecked: false
    }))
    setLists(newLists);
    setState(prevState => ({
      ...prevState,
      isChecked: !prevState.isChecked
    }));
  }

  const handleDel = async () => {
    const id = state.item.DENPYONO;
    const res =  await POST(API_URL_DELETE_SCHEDULED, {id});
    if(res.status === 200) {
      setState(prevState => ({
        ...prevState,
        showDelete: false,
        showSuccess: true
      }));
    }
  };

  const handleDelMulti = async () => {
    const ids = [...state.ids];
    ids && ids.length > 0 && ids.forEach(async id => {
      const res =  await POST(API_URL_DELETE_SCHEDULED, {id});
      if(res.status === 200) {
        setState(prevState => ({
          ...prevState,
          showDeleteMulti: false,
          showSuccessMulti: true
        }));
      }
    });
  };

  const handleHideDel = () => setState(prevState => ({
    ...prevState,
    item: {},
    showDelete: false,
  }));

  const handleHideDelMulti = () => setState(prevState => ({
    ...prevState,
    ids: [],
    showDeleteMulti: false,
  }));

  const handleShowDel = () => setState(prevState => ({
    ...prevState,
    showDelete: true,
  }));

  const handleShowDelMulti = () => setState(prevState => ({
    ...prevState,
    showDeleteMulti: true,
  }));

  const hide = () => {
    setState(prevState => ({
      ...prevState,
      showSuccess: false,
    }));
    window.location.reload();
  };

  const handleConfirmDelete = (item) => {
    setState(prevState => ({
      ...prevState,
      isDel: true,
      item,
    }));
    handleShowDel();
  }

  const handleConfirmDeleteMulti = () => {
    const ids = [...lists].filter(item => item && item.isChecked).map(item => item.DENPYONO);
    setState(prevState => ({
      ...prevState,
      ids,
    }));
    handleShowDelMulti();
  }

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading pb-3">
          <h3 className="header-title">
            <strong>検索結果</strong>
          </h3>
        </div>
        {data && data.length > 0 ? (
          <div className="panel-body">
            <table className="table table-bordered">
              <thead className="table-warning">
                <tr>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">行</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">伝票番号</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">起票部門</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">伝票日付</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">申請日</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">出納方法</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">出張目的</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">金額</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">行選択</span></th>
                </tr>
              </thead>
              <tbody>
                {lists && lists.map((item, index) => (
                  <tr key={index} onDoubleClick={() => handleRedirect(item)} style={{background: item.isChecked ? '#198754' : '', color: item.isChecked ? '#f1f1f1' : ''}}>
                    <td>
                      <span>{index + 1}</span>
                    </td>
                    <td>
                      <span>{item.DENPYONO}</span>
                    </td>
                    <td>
                      <span>{item.BUMONNM}</span>
                    </td>
                    <td>
                      <span>{formatDate(item.DENPYODT)}</span>
                    </td>
                    <td>
                      <span>{formatDate(item.UKETUKEDT)}</span>
                    </td>
                    <td>
                      <span>{item.SUITOKB}</span>
                    </td>
                    <td>
                      <span>{item.BIKO}</span>
                    </td>
                    <td>
                      <span>{item.KINGAKU}</span>
                    </td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        { item.isChecked ?
                          <span 
                            className="back-icon" 
                            style={{cursor: 'pointer'}} 
                            checked={item.isChecked} name={item.DENPYONO} 
                            onClick={() => handleChecked(item.DENPYONO)}
                          >ー</span> :
                          <input 
                            className="input form-check-input" 
                            type="checkbox" style={{cursor: 'pointer'}} 
                            checked={item.isChecked} name={item.DENPYONO} 
                            onChange={() => handleChecked(item.DENPYONO)}
                          />
                        }
                        {
                          item.isChecked && <span className="del-icon" onClick={() => handleConfirmDelete(item)}>ｘ</span>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{fontSize: '1.1rem', fontWeight:'bold'}}>交通費計</td>
                  <td style={{fontSize: '1.1rem', fontWeight:'bold'}}>{moneys}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>

                    {state.isChecked ? <span 
                      className="back-icon" 
                      style={{cursor: 'pointer'}} 
                      onClick={handleUnCheckedMulti}
                    >ー</span> :
                    <input 
                      className="input form-check-input" 
                      type="checkbox" style={{cursor: 'pointer'}} 
                      onChange={handleCheckedMulti}
                    />}
                    {
                      state.isChecked && <span className="del-icon" onClick={handleConfirmDeleteMulti}>ｘ</span>
                    }
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>検索結果がありません。</div>
        )}
      </div>
      <ModalSuccess show={state.showSuccess} hide={hide} id={state.item.DENPYONO} item={state.item} isDel={state.isDel}/>
      <ModalDelete show={state.showDelete} hide={handleHideDel} handleDel={handleDel} id={state.item.DENPYONO} setShowDelete={setState}/>
      <ModalSuccessMulti show={state.showSuccessMulti} hide={hide} ids={state.ids}/>
      <ModalDeleteMulti show={state.showDeleteMulti} hide={handleHideDelMulti} handleDel={handleDelMulti} ids={state.ids} setShowDelete={setState}/>
    </div>
  )
}

export default HeadingResult;