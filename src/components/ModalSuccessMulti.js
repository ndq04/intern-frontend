import {Modal, Button} from 'react-bootstrap';

const ModalSuccessMulti = ({show, hide, ids}) => {
  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>
        <div>
          <span style={{fontWeight:600}}>お知らせ</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <span>データを正常に削除する</span>
          <p>伝票番号:</p>
          <ul>
            {
              ids.map(item => <li key={item}>{item}</li>)
            }
          </ul>
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

export default ModalSuccessMulti