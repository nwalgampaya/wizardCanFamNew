import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";
// import FormContainer from './containers/FormContainer';
//import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import logo1 from "../src/img/logo1.png";
import logoM from "../src/img/logoM.png";
// import background from '../src/img/headervector.png';
import uniLogo from "../src/img/UniLogo.png";
import globalHealthLogo from "../src/img/globalHealth.png";
import proneImg from "../src/img/ProneProne.png";
import cFamImg from "../src/img/cfr-banner.jpg";

import Styles from "./Styles";

import "./App.css";
import "./index.css";
export default class Wizard extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {},
      counter: 0,
      isModalOpen: true
    };
    // this.baseState = this.state
    // this.previous = this.previous.bind(this);
  }

  rndno = (min, max) => {
    return Math.floor(Math.random() * (max - min));
  };

  searchPatientInParent() {
    console.log("call parent to search patients");
    this.props.onSearchPatient();
  }

  navigateNextOnSuccess() {
    this.next();
  }

  next = values => {
    // console.log("this.page" + this.state.page);
    // if(this.state.page == 3 || this.state.page == 4 || this.state.page == 5 || this.state.page == 6){
    //   this.state.counter= this.state.counter+1;
    //   let rnd=  this.rndno(0,3);
    //   // console.log("******************* : " + this.state.counter);
    //   if(this.state.counter==5){
    //               console.log("******************* counter==5 : " + this.state.counter);
    //       // this.state.page = 7;
    //       rnd=3;
    //   }
    //   console.log("******************** If: "+rnd);
    //   this.setState(state => ({
    //   page: Math.min(4+rnd  , this.props.children.length - 1),
    //   values
    // }))}
    // else{
    const { onSavePatientOnly } = this.props;
    const { onSelectCancerFamId } = this.props;
    const { onSaveCancerFamilyID } = this.props;

    console.log("********************(Next) in else" + this.state.page);
    // this.state.isModalOpen=true
    // && this.state.page > 1
    if (this.props.choosePathFamily == true) {
      console.log("PAGE NO : " + this.state.page);

      /* To access function onSelectCancerFamId() in FamilySearch.js */

      if (this.state.page == 6) {
        console.log("NExT : " + this.state.page);
        this.setState(state => ({
          page: Math.min(state.page + 1, this.props.children.length - 1),
          values
        }));
        return onSelectCancerFamId(values);
      }
      // To access function onSaveCancerFamilyID() in FamilySaveInfo.js
      if (this.state.page == 7) {
        console.log("NExT : " + this.state.page);
        this.setState(state => ({
          page: Math.min(state.page + 1, this.props.children.length - 1),
          values
        }));
        return onSaveCancerFamilyID(values);
      }
      if (this.state.page > 6) {
        this.setState(state => ({
          page: Math.min(state.page + 1, this.props.children.length - 1),
          values
        }));
      } else {
        this.setState(state => ({
          page: Math.min(state.page + 6, this.props.children.length - 1),
          values
        }));
      }
    } else {
      if (this.state.page > 5) {
        this.setState(state => ({
          page: Math.min(state.page + 3, this.props.children.length - 1),
          values
        }));
      } else if (this.state.page == 5) {
        console.log("NEZT PPPPPPPPPP : " + this.state.page);

        this.setState(state => ({
          page: 0,
          values
        }));
      } else {
        console.log("NEZT : " + this.state.page);
        this.setState(state => ({
          page: Math.min(state.page + 1, this.props.children.length - 1),
          values
        }));
        // if (this.state.page == 3) {
        //   return onSavePatientOnly(values);
        // }
      }
    }
    // }
  };
  // this.setState(state => ({
  //   page: Math.min(state.page + 1, this.props.children.length - 1),
  //   values
  // }))}

  ExitRecord = () => {
    this.setState(state => ({
      page: 0
    }));
    window.location.reload();
  };

  logout = () =>
    this.setState(state => ({
      page: 0
    }));
  previous = () => {
    const { onCancerInfoPage } = this.props;

    console.log("PAGE NO PREVIOUS " + this.state.page);
    // && this.state.page > 1
    if (this.props.choosePathFamily == true) {
      if (this.state.page == 7) {
        this.setState(state => ({
          page: 6
        }));
      } else if (this.state.page == 6) {
        this.setState(state => ({
          page: 0
        }));
      } else {
        this.setState(state => ({
          page: Math.max(state.page - 1, 0)
        }));
      }
    } else {
      if (this.state.page == 4) {
        console.log("PAGE NO in onCancerInfoPage" + this.state.page);

        this.setState(state => ({
          page: Math.max(state.page - 1, 0)
        }));
        return onCancerInfoPage();
      }
      if (this.state.page > 6) {
        this.setState(state => ({
          page: 6
        }));
      } else {
        this.setState(state => ({
          page: Math.max(state.page - 1, 0)
        }));
      }
    }
  };
  // previous = () =>
  //   this.setState(state => ({
  //     page: Math.max(state.page - 1, 0)
  //   }))

  endSession = () => {
    this.setState(state => ({
      // page: Math.max(state.page + 1, 0)
      page: 0
    }));
  };
  selectCategory = () => {
    // const {returnToFirst } = this.props
    const { getCategoryFromServer } = this.props;
    // const {accessWizard} = this.props
    this.setState(state => ({
      page: Math.max(state.page + 1, 0)
      // page: 0
    }));
    //  this.setState(this.baseState)
    // const { page } = this.state
    // return accessWizard();
    return getCategoryFromServer();
  };
  /**
   * NOTE: Both validate and handleSubmit switching are implemented
   * here because 🏁 Redux Final Form does not accept changes to those
   * functions once the form has been defined.
   */

  validate = values => {
    console.log("validate in wizard page");
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = values => {
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;

    // if(isLastPage){
    if (this.state.page == 1) {
      this.next(values);
      // return onSubmit(values)
    }
    // else if(this.state.isModalOpen){
    //   console.log("dialog Open")
    // }
    else {
      this.next(values);

      console.log(
        "******************** PRESSED ON SUBMIT **********************************"
      );
      return onSubmit(values);
    }
  };

  render() {
    // var sectionStyle = {
    //   width: "100%",
    //   height: "400px",
    // backgroundImage: `url(${background})`
    // };
    const alignButton = { marginLeft: "40%" };
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;
    return (
      <div>
        <div className="container">
          {/* <div className="header"> */}
          {/* <div className="pull-left logo">
              <a><img src={uniLogo} alt={"logo"} /> </a>
            </div>
            <div className="pull-right top_menu">
              <a ><img src={proneImg} alt={"logoM"} /> </a>
            </div> */}
          {/* </div> */}
        </div>
        <p />
        <div />
        <div className="container">
          <div className="content_body centered">
            <div>
              <a>
                <img className="img-banner" src={cFamImg} />{" "}
              </a>
            </div>{" "}
            <br />
            <Form
              initialValues={values}
              validate={this.validate}
              onSubmit={this.handleSubmit}
            >
              {({ handleSubmit, submitting, values }) => (
                <form
                  onSubmit={handleSubmit}
                  onKeyPress={event => {
                    if (event.which === 13 /* Enter */) {
                      event.preventDefault();
                    }
                  }}
                >
                  {activePage}
                  <br />
                  <div className="buttons">
                    {/* {page > 0 && (
                      <button type="button" onClick={this.previous}>
                        « Previous
                </button>

                    )} */}
                    {/* {isLastPage && ( */}
                    {((page == 8 && this.props.choosePathFamily) ||
                      page == 5) && (
                      <button
                        className="btn btn-primary pull-right"
                        type="button"
                        onClick={this.endSession}
                      >
                        Finish
                      </button>
                    )}
                    {/* {page > 0 && (
                      <button className="btn btn-primary" styles={{ float: 'left', paddingLeft: '10px' }} type="button" onClick={this.previous}>
                        Previous
                </button>


                    )} */}

                    {/* Invisible button to get the next button allignment correctly */}
                    {(page == 0 || page == 2) && (
                      <button className="invisible" type="button" />
                    )}

                    {/* { page == 3 && (<button className="btn btn-primary" type="button" onClick={this.previous}> Back</button>)} */}
                    {/* (!this.props.choosePathFamily ||page != 6 ||page == 7) && */}
                    {page > 0 && page != 2 && page != 1 && (
                      // (page != 8 && this.props.choosePathFamily) && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.previous}
                      >
                        {" "}
                        Previous
                      </button>
                    )}
                    {page == 1 && (!this.props.choosePathFamily || page == 6) && (
                      <button className="invisible" type="button">
                        Invisible
                      </button>
                    )}
                    {page == 1 ||
                      (page == 8 && this.props.choosePathFamily && (
                        <button className="invisible" type="button">
                          Invisible
                        </button>
                      ))}

                    {(page == 3 || page == 4 || page == 2 || page == 5) && (
                      <button className="invisible" type="button">
                        Invisible Invisible Invisible Invisible Invisible{" "}
                      </button>
                    )}
                    {(page == 3 || page == 4 || page == 2 || page == 5) && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.ExitRecord}
                      >
                        {" "}
                        Exit Record
                      </button>
                    )}
                    {(page == 3 || page == 4 || page == 2 || page == 5) && (
                      <button className="invisible" type="button">
                        xx{" "}
                      </button>
                    )}
                    {(page == 3 || page == 4 || page == 2 || page == 5) && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.logout}
                      >
                        {" "}
                        Logout
                      </button>
                    )}

                    {/* { page>0 && (<button className="btn btn-primary" type="button" > Logout</button>)} */}
                    {/* page !=3 &&  */}

                    {!isLastPage &&
                      (page > 0 &&
                        page != 2 &&
                        page != 1 &&
                        page != 4 &&
                        page != 5) &&
                      (page != 7 && this.props.choosePathFamily) && (
                        // (page != 7 && this.props.choosePathFamily))
                        <button
                          disabled={
                            !this.props.isChecked && this.props.choosePathFamily
                          }
                          className="btn btn-primary pull-right"
                          type="button"
                          onClick={() => this.next()}
                        >
                          Proceed
                        </button>
                      )}

                    {page == 3 && (
                      <button
                        disabled={
                          !this.props.isChecked && this.props.choosePathFamily
                        }
                        className="btn btn-primary pull-right"
                        type="button"
                        onClick={() => this.next()}
                      >
                        Proceed
                      </button>
                    )}
                    {page == 2 && (
                      <button
                        className="btn btn-primary pull-right"
                        type="submit"
                      >
                        Proceed-s
                      </button>
                    )}
                    {/* Need to be type of submit in order to get the formik validation. */}
                    {/* {page ==3  &&(<button className="btn btn-primary pull-right" type="submit"  >Next</button>)}  */}
                    {page == 1 && (!this.props.choosePathFamily || page == 6) && (
                      <button
                        style={alignButton}
                        className="btn btn-primary"
                        type="button"
                        onClick={() =>
                          //this.next()
                          this.searchPatientInParent()
                        } /*type="submit"*/
                      >
                        Search
                      </button>
                    )}

                    {/* TODo add condition to disable save button when nothing edited or new added */}
                    {(page == 4 ||
                      (page == 7 && this.props.choosePathFamily)) && (
                      <button
                        disabled={
                          true
                            ? !(
                                this.props.isCanecerAdded ||
                                this.props.isCancerEdited ||
                                this.props.isCanFamEdited
                              )
                            : false
                        }
                        className=" btnOverWrite pull-right btn-primaryOverWrite"
                        type="submit"
                      >
                        Save to database
                      </button>
                    )}

                    {/* {!page == 0 && !page == 1 && !isLastPage && <button className="btn btn-primary pull-right " type="submit">  Next  </button>} */}
                    {/* {page == 1 && (<button className="btn btn-primary pull-right" type="submit" disabled={submitting}>
                      Start</button>
                    )} */}
                    {/* {(isLastPage ) && ( */}
                    {/* {(page == 3 &&
                      <button className="btn btn-primary pull-right" type="submit" disabled={submitting}>Next</button>
                    )} */}
                    {/* {(page ==3  &&
                      <button className="btn btn-primary pull-right" type="button" disabled={submitting} onClick={this.selectCategory}>Categorise colonoscopy</button>
                    )} */}
                  </div>

                  {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                </form>
              )}
            </Form>
          </div>{" "}
        </div>
      </div>
    );
  }
}
