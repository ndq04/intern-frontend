import {Modal, Button} from 'react-bootstrap';

const ModalDelete = ({show, hide, id, setShowDelete}) => {
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
          <div>
            <span>伝票番号: {id}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={hide}>
          はい
        </Button>
        <Button variant="danger" onClick={()=>setShowDelete(false)}>
          いいえ
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDelete