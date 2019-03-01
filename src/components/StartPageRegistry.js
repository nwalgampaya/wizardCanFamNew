// import React from "react";
// import ReactDOM from "react-dom";
// import Wizard from '../Wizard'
// import Welcome from './steps/Welcome.js'
// import CancerInfo from "./steps/CancerInfo";
// import BootstrapDialog from "./dialog/BootstrapDialog";
// import PreviewInfo from "./steps/PreviewInfo";
// import ChoosePath from "./steps/ChoosePath";
// import Individual from "./steps/Individual";
// import Family from "./steps/Family";
// import FormikApp from"./CancerFamilyReg"
// import '../App.css';

// export default class StartPageRegistry extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             //Used to get the selection between the family and the individual
//             choosePathFamily:'',
//             firstPage:'',
//             secoundPage:'',
//             thirdPage:'',
//             fourthPage:'',

//             //Get data from child
//             arrayOfChangedFields:[],
//         }
//     }

//     handleChooseOption = (chooseTheFamily) => {
//         this.setState({choosePathFamily: chooseTheFamily});
        
//     }

//     choosePath(){
//         console.log("choose path : " + this.state.choosePathFamily)
//              if(this.state.choosePathFamily){
//                  //  fourthPage:'',
                 
//                  return <Family/>
//                 }else {
//                     this.state.firstPage= <FormikApp />
//                     this.state.secoundPage=<CancerInfo onSaveChangeInfo={this.handleChangedRecFrmChild} arrayEditedData= {this.state.arrayEditedData}/>
//                     this.state.thirdPage = <PreviewInfo  arrayEditedData= {this.state.arrayEditedData} enableSaveButton={this.state.enableSaveButton}  />
//                  return <Individual />
//              }
 
//      }

//     handleChangedRecFrmChild = (arrayEditedDataArr, enableSaveButton ) => {
//         this.setState({arrayEditedData: arrayEditedDataArr});
//         this.setState({enableSaveButton : enableSaveButton});
       
//     }
//     onSubmit(e){
//         console.log("in SUBMIT =============================")
//     }

//     // sendDataToPreview(arrayOfChangedFields) {
//     //     console.log("In end sendDataToPreview *******8888888888888888888888")
//     //     arrayOfChangedFields.map((value,i)=>{
//     //         console.log("value" + value.column)
            
//     //         // this.state.arrayOfChangedFields= value;
//     //     })

//         // this.setState({arrayOfChangedFields: arrayOfChangedFieldsArr})
//         // window.location.reload(),
          
//     //   }
//     render(){

//         return (
//             // isModalOpenValue={this.state.isModalOpen}
//             // The wizard.page are choesn depending on the flag "choosePathFamily" if true the pages from Six onwards are traversed
//             // IMPORTANT "next()" and "previous() functions of the "wizard.js" page should be modified for the selection of the right pages.
            
//             <Wizard choosePathFamily={this.state.choosePathFamily} onSubmit={this.onSubmit.bind(this)}>
//                 <Wizard.Page>
//                     <Welcome />
//                 </Wizard.Page> 
//                 <Wizard.Page>
//                     <ChoosePath onChooseOption={this.handleChooseOption}/>
//                 </Wizard.Page>
//                 <Wizard.Page>
//                     {this.choosePath()}
//                 </Wizard.Page>
// {/* Pages for the INDIVIDUAL flow START                 */}                
//                 <Wizard.Page>
//                     {this.state.firstPage}
//                 </Wizard.Page> 
//                 <Wizard.Page >
//                     {this.state.secoundPage}
//                 </Wizard.Page>
//                 <Wizard.Page>
//                     {this.state.thirdPage}
//                 </Wizard.Page>
// {/* Pages for the INDIVIDUAL flow END                 */}                

// {/* Pages for the Family flow START                 */}
//                 <Wizard.Page>
//                     <div>
//                         Six
//                     </div>
//                 </Wizard.Page>
//                 <Wizard.Page>
//                     <div>
//                         Seven
//                     </div>
//                 </Wizard.Page>
// {/* Pages for the Family flow END                 */}                
//                 <Wizard.Page>
//                     <div>
//                         Last
//                     </div>
//                 </Wizard.Page>
//             </Wizard>
//         )
//     }
// }