import React from 'react';
import ReactDOM from 'react-dom';
// import { Popover, PopoverBody } from 'reactstrap';
import {Button, DropdownButton, MenuItem, Modal,  OverlayTrigger, Tooltip} from 'react-bootstrap';
// import '../../components/site.css'  

export default class BootstrapDialogOld extends React.Component {

    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleSave = this.handleSave.bind(this);    
        this.handleTxtChange = this.handleTxtChange.bind(this);
  
      this.state = {
        show: false,
        textValue:'test123'
      };
    }
  handleTxtChange (e) {  
  //alert("txt" + e.target.value)
  // this.state.textValue= e.target.value;
  this.setState({ textValue: e.target.value})
    
    }
    handleClose() {
      this.setState({ show: false });
    }
    handleSave() {    
    alert("Saving" + this.state.textValue)
     this.setState({ show: false });
    }
  
    handleShow() {
      // alert("clicked")
      this.setState({ show: true });
    }
  
    render() {
      // const popover = (
      //   <Popover id="modal-popover" title="popover">
      //     very popover. such engagement
      //   </Popover>
      // );
      const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
  
      return (
        <div>
          <p>Click to get the full Modal experience!</p>
  
          <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
            Launch demo modal
          </Button>
  
          <Modal show={this.state.show} onHide={this.handleClose} keyboard={false} >
          
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <input type="text" onChange={this.handleTxtChange} value= {this.state.textValue}/>
              <h4>Text in a modal</h4>
              <p>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </p>
  
              <h4>Tooltips in a modal</h4>
              <p>
                there is a{' '}
                <OverlayTrigger overlay={tooltip}>
                  <a href="#tooltip">tooltip</a>
                </OverlayTrigger>{' '}
                here
              </p>
  
              <hr />
  
              
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
              <Button onClick={this.handleSave}>Save</Button>
  
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }
  
//   render(<Example />);