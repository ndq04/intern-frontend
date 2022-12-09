import { useState } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { GET } from '../utils/apiHelper';
import { API_URL_DEPARTMENT } from '../contance';
import { valid } from '../utils/valid';

const ModalDepartment = ({
  selectDepartment, setSelectDepartment, departments, setDepartments, showDepartmentPopup, close, onChange, setFormData, setDepartmentErr
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
    setSelectDepartment(selectDepartment);
    const findItem = departments.find(item => item.BUMONCD === selectDepartment);
    setFormData((formData)=>({
      ...formData,
      departmentCode: selectDepartment,
      departmentName: findItem.BUMONNM,
    }));
    setDepartmentErr('');
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
    const data = {...state};

    GET(API_URL_DEPARTMENT, data)
    .then(res=> res && res.data && setDepartments(res.data))
    .catch(err => console.log(err));
  }
  const {errMessage} = valid(state);
  const isValid = Object.keys(errMessage).length > 0;

  return (
    <Modal show={showDepartmentPopup}>
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
              <button className="btn btn-primary" disabled={isValid}>検索</button>
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
                  departments.map((item, index) => (
                    <tr key={index}>
                      <td>
                      <div className="form-check">
                        <input 
                          value={item.BUMONCD} 
                          className="form-check-input" 
                          type="radio" 
                          style={{cursor:'pointer'}}
                          checked={selectDepartment === item.BUMONCD}
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
        <Button variant="primary" onClick={handleSave} disabled={!selectDepartment}>
          選択
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          戻る
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDepartment