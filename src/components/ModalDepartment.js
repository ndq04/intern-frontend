import { useState } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { GET } from '../utils/apiHelper';
import { API_URL_DEPARTMENT } from '../contance';
import { valid } from '../utils/valid';

const ModalDepartment = ({
  close, onChange, parentState, setParentState
}) => {

  const [state, setState] = useState({
    departmentCode: '',
    departmentName: ''
  });

  const handleChange = value => {
    onChange(value);
  }

  const handleClose = () => {
    close();
    setState({
      departmentCode: '',
      departmentName: ''
    })
  }
  
  const handleSave = () => {
    handleClose();
    const findItem = parentState.departments.find(item => item.BUMONCD === parentState.selectDepartment);
    setParentState((prevState)=>({
      ...prevState,
      formData: {
        ...prevState.formData,
        departmentCode: parentState.selectDepartment,
        departmentName: findItem.BUMONNM,
      },
      departmentErr: '',
      selectDepartment: parentState.selectDepartment
    }));
  }

  const handleChangeForm = (e) => {
    const {value, name} = e.target;
    setState({
      ...state,
      [name] : value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...state,
      departmentName: state.departmentName.trim(),
    };

    GET(API_URL_DEPARTMENT, data)
    .then(res=> res && res.data &&
      setParentState(prevState => ({
        ...prevState,
        departments: res.data,
      })) 
    )
    .catch(err => console.log(err));
  }
  const {errMessage} = valid(state);
  const isValid = Object.keys(errMessage).length > 0;

  return (
    <Modal show={parentState.showDepartmentPopup}>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="row row-cus pb-3">
            <div className="col-md-2 d-flex">
              <label className="label">部門コード</label>
              <input type="text" className="input-cus" name="departmentCode" value={state.departmentCode} onChange={handleChangeForm}/>
            </div>
            {errMessage.departmentCode && <div className="pt-2">
            <span className="text-danger">{errMessage.departmentCode}</span>
          </div>}
          </div>
          <div className="row row-cus pb-3">
            <div className="d-flex">
              <label className="label">部門名</label>
              <input type="text" className="input-cus" name="departmentName" value={state.departmentName.replace(/^\s+|\s+$/gm,'')} onChange={handleChangeForm}/>
            </div>
          </div>
          <div className="row row-cus pb-3">
            <div className="d-flex">
              <label className="label"></label>
              {
                isValid ? <button className="btn btn-secondary" disabled={isValid}>検索</button> :
                <button className="btn btn-success">検索</button>
              }
            </div>
          </div>
        </form>

        <div className="panel-body">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">選択</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">部門コード</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">部門名</span></th>
                </tr>
              </thead>
              <tbody>
                {
                  parentState.departments.map((item, index) => (
                    <tr key={index}>
                      <td>
                      <div className="form-check">
                        <input 
                          value={item.BUMONCD} 
                          className="form-check-input" 
                          type="radio" 
                          style={{cursor:'pointer'}}
                          checked={parentState.selectDepartment === item.BUMONCD}
                          onChange={() => handleChange(item.BUMONCD)}
                        />
                      </div>
                      </td>
                      <td>
                        <span>{item.BUMONCD}</span>
                      </td>
                      <td>
                        <span>{item.BUMONNM}</span>
                      </td>
                    </tr>
                  ))
                } 
              </tbody>
            </table>
          </div>
      </Modal.Body>
      <Modal.Footer>
        {
        !parentState.selectDepartment  ? <Button variant="secondary" disabled={!parentState.selectDepartment}>選択</Button> :
          <Button variant="success" onClick={handleSave} >選択</Button>
        }
        <Button variant="danger" onClick={handleClose}>
          戻る
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDepartment