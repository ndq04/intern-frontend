import {Modal, Button} from 'react-bootstrap';

const ModalSuccess = ({show, hide, id, item, isDel}) => {
  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>
        <div>
          <span style={{fontWeight:600}}>お知らせ</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <span>{(item && !isDel) ? 'データ更新成功。' : (isDel && item) ? 'データを正常に削除する' : 'データを正常に追加。'}</span>
          <div>
            <span>伝票番号: {id}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={hide}>
          はい
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalSuccess