import {Modal, Button} from 'react-bootstrap';

const ModalDeleteMulti = ({show, hide, ids, setShowDelete, handleDel}) => {
  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>
        <div>
          <span style={{fontWeight:600}}>お知らせ</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <span>データを削除しますか？</span>
          <p style={{color:'red', fontWeight:'bold'}}>伝票番号:</p>
          <ul>
            {
              ids.map(item => <li key={item} style={{color:'red', fontWeight:'bold'}}>{item}</li>)
            }
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleDel}>
          はい
        </Button>
        <Button variant="danger" onClick={()=>setShowDelete(prevState => ({
          ...prevState,
          item: {},
          showDeleteMulti: false,
        }))}>
          いいえ
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDeleteMulti