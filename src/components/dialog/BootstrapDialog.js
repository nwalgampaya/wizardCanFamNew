import React from 'react';
import ReactDOM from 'react-dom';
// import { Popover, PopoverBody } from 'reactstrap';
import {Button, DropdownButton, MenuItem, Modal,  OverlayTrigger, Tooltip} from 'react-bootstrap';
// import '../../components/site.css'  

export default class BootstrapDialog extends React.Component {

    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleSave = this.handleSave.bind(this);    
        this.handleTxtChange = this.handleTxtChange.bind(this);
  
      this.state = {
        data:[{
          id: 1,
          age: "Simon Bailey"
        }, {
          id: 2 ,
          age: "Thomas Burleson"
        }],
      
        show: false,
        textValue:'test123',
        selectedId:''
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
    alert("Saving" + this.state.data[this.state.selectedId].age)
     this.setState({ show: false });
    }
  
    handleShow(id) {
      console.log("in handleShow"+  id )
      this.setState({ show: true });
      this.state.selectedId=id
      console.log("in handleShow selectedId ;"+  this.state.selectedId )
    }
    // hs= () =>{
    //   this.setState({ show: true });
    // }
  
    componentDidMount(){
       
        
      // const urlProfession = properties.baseUrl + "practitionerscore/" ;
      // fetch saved practitioner rec id
      console.log("SEL this.jsonId%%%%%%%%%%%%%%%%%%% : " + this.state.jsonId)
      const urlProfession = "http://localhost:8090/ProneSpringBoot/api/practitioners";
      fetch(urlProfession)
        .then(response => response.json())
        .then((datax) => {
  
          console.log("score" + datax);
          this.setState({
            data: datax,
  
          });
          // this.state.profession.push(data);
        })
  
    
}

    render() {

      let rows = this.state.data.map((person,i) => {
        // console.log("in render"+ person.id)
        // console.log("in render i :"+ i)
      return <PersonRow key = {person.id} rowId ={i} data = {person}  handleShow= {this.handleShow}/>
    })

      // const popover = (
      //   <Popover id="modal-popover" title="popover">
      //     very popover. such engagement
      //   </Popover>
      // );
      const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
  
      return (
        <div>
          <p>Click to get the full Modal experience!</p>
  
          <table>
            <tbody>
              <tr>
                <th>
                    TUMOR_NO
                </th>
                <th>
                    SITE
                </th>
                <th>
                    LATERAL
                </th>
                <th>
                    HISTOLOGY
                </th>
                <th>
                    BEHAVIOR
                </th>
                <th>
                    DIAGNOSIS DATE
                </th>
                <th>
                    AGE DIAGNOSIS
                </th>
                <th>
                    DIAGNOSIS SOURCE:
                </th>
                <th>
                    TISSUE
                </th>
                <th>
                    UPDATE
                </th>
              </tr>
              
                  { rows }
         
            </tbody> 
        </table>

          {/* <Button bsStyle="primary" bsSize="small" onClick={this.handleShow}>
            Launch demo modal
          </Button> */}
  
          <Modal show={this.state.show} onHide={this.handleClose} keyboard={false} selectedid={this.state.selectedId}>
          
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* value= {}this.state.data[].name */} 
            {/* Condition for the value is needed to render the element at the the initial load */}
            <input type="text" onChange={this.handleTxtChange}  value = {this.state.selectedId=='' ? this.state.data[0].age : this.state.data[this.state.selectedId].age}/>
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
  const PersonRow = (props) => {

    return (
<tr>
        <td>
          { props.data.id }
        </td>
        <td>
          { props.data.age }
        </td>
        <td>
          { props.data.complaints }
        </td>
        <td>
          { props.data.location }
        </td>
        <td>
          { props.data.score }
        </td>
        <td>
          { props.data.sex }
        </td>
        <td>
          { props.data.specialty }
        </td>
        <td>
          { props.data.specificcomplaint }
        </td>
        <td>
          { props.data.issuetype }
        </td>
        <td>
           <Button  bsSize="small" onClick={()=> props.handleShow(props.rowId)} >
             Edit
           </Button>
        </td>

      </tr>      
      
      // <tr>
      //   <td>
      //     { props.data.id }
      //   </td>
      //   <td>
      //     { props.data.age }
      //   </td>
      //   <td>
         
      //    <Button  bsSize="small" onClick={()=> props.handleShow(props.rowId)} >
      //        Edit
      //      </Button>
              
      //   </td>
      // </tr>
    );
    {/* { ()=>  (this.show=true)     } */}
    // <a href="no-javascript.html" title="Get some foo!" id="foo">Edit</a>
  }
//   render(<Example />);