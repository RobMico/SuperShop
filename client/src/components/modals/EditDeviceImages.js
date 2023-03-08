import React, {useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AddImagesModal from "./sub/AddImagesModal";
import RemoveImagesModal from "./sub/RemoveImagesModal";

const EditDeviceImages = ({ show, onHide, device }) => {
    // const [_remImages, _setRemImages] = useState([])
    // const [_newImages, _setNewImages] = useState([]);
    // const [_curImgs, _setCurImgs] = useState([]);
    // const [_filesCount, _setFilesCount] = useState(0);


    const [_state, _setState] = useState(0)


    // useEffect(() => {
    //     _setCurImgs(device.img.split(';').filter(e => e != ''));        
    //     _setFilesCount(8-_curImgs.length)        
    // }, [])

    const _editDevice = async () => {
        //TODO
    }

    const _setRemoved = () => {

    }
    // const _selectFile=(e)=>{
    //     if(e.target.files.length>_filesCount)
    //     {
    //         alert("You can not upload so much files")
    //         e.target.value=null;
    //         return;
    //     }
    //     //_setImg(e.target.files);
    // }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit images
                </Modal.Title>
            </Modal.Header>

            {show?<Modal.Body>
                {_state == 0 ? <><Button onClick={() => _setState(1)}>Add images</Button><Button onClick={() => _setState(2)}>Remove images</Button>
                </> : (_state == 1 ?
                    <>
                    <Button onClick={() => _setState(2)}>Remove images</Button>                    
                    <AddImagesModal device={device} onHide={onHide}/>
                    </>
                    :
                    <>
                    <Button onClick={() => _setState(1)}>Add images</Button>
                    <RemoveImagesModal device={device} onHide={onHide}/>
                    </>)}
                {/* <Form>
                    {_curImgs.map(e => <Row>
                        
                        <Col><Image height="100px" width="100px" src={process.env.REACT_APP_API_URL + e} /></Col>
                        <Col><Button onClick={_setRemoved.bind(e)}>Remove</Button></Col>
                    </Row>)}
                    {_filesCount==0?'':<Row> <Form.Label> New image(up to {_filesCount}):</Form.Label><Form.Control className="mt-2" type="file" onChange={_selectFile} multiple={true}/></Row>}
                </Form> */}
            </Modal.Body>:''}
            <Modal.Footer>
                <Button variant="outline-danger" onClick={() => onHide(false)}>Close</Button>
                {/* <Button variant="outline-success" onClick={_editDevice}>Submit</Button> */}
            </Modal.Footer>
        </Modal>
    );
}

export default EditDeviceImages;