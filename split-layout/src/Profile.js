import React, { Component } from 'react';
import './Option.css'; 
import ReactModal from 'react-modal';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import { Checkbox, RaisedButton } from 'material-ui';
import { get_variables, test_variables } from './Fourier_Motzkin.js'


class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAccordionItems: [],
      fullNamesFunc: '',
      showFullNamesFunc: false,
      functionEditable: false,
      showModal: false,
      isValuesOpen: false,
      isAssumptionsOpen: false,
      viewedValue: null,
      showLinkValueModal: null
    }
    
    var modalOverlayStyle = {
        position          : 'fixed',
        top               : '60px',
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(150, 150, 150, 0.50)'
    }

    this.customStyles = {
      overlay : modalOverlayStyle,
      content : {
        top                   : '25%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };
    
    this.buttonColor = '#6BB9F4'

    this.showLinkValuesDialog = this.showLinkValuesDialog.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.useFM = this.useFM.bind(this);
  }


  getPreferredMatrix() {
    var preferredMatrix = [];
    for (var preferred of this.props.myPreferred) {
      var preferredArray = [];
      for (var i = 0; i < this.props.values.length; i++) {
        var value = this.props.values[i];
        if (preferred.func[value.code]) {
          preferredArray[i] = preferred.func[value.code];
        }
        else {
          preferredArray[i] = 0;
        }
      }
      preferredArray[this.props.values.length] = 1;
      preferredMatrix.push(preferredArray);
    }

    return preferredMatrix;
  }

  handleShowCalculateFunc() {
    this.setState({
      showCalculateFunc: true
    })


    var preferredMatrix = this.getPreferredMatrix();

    var vs;
    try {
      vs = get_variables(preferredMatrix);
    }
    catch(e) {
      this.setState({
        fmFunc: 'No linear solution'
      }) 
      return;
    }

    var calculatedFunc = '';
    for (var i=0; i<vs.length-1; i++) {
      if (vs[i] !== 0) {
        if (vs[i].toString()[0] === '-' || i === 0) {
          calculatedFunc += vs[i] + '*' + this.props.values[i].code;
        }
        else {
          calculatedFunc += '+' + vs[i] + '*' + this.props.values[i].code;
        }
      }
    }

    this.setState({
      fmFunc: calculatedFunc
    })

    // test_variables(preferredMatrix, vs)  
  }


  handleEditFunction(event) {
    event.stopPropagation();

    if (window.confirm(!this.state.functionEditable ? 'This will inactivate your sentiments' : 'This will let your sentiments overwrite your function')) { 
      this.setState({
        functionEditable: !this.state.functionEditable,
        activeAccordionItems: [...this.state.activeAccordionItems, 2]
      });

      var tempFunc = '';
      if (this.state.functionEditable) {
        this.setState({
          utilFunc: this.state.sentiments.map(s => s.func).join('+')
        });
      }
    }
  }

  handleCloseCalculateFunc() {
    this.setState({
      showCalculateFunc: false
    })
  }

  handleShowFullFunctionNames() {
    var tempFunc = this.state.utilFunc;
    for (var value of this.props.rightListSlider) {
      tempFunc = tempFunc.replace(value.code, value.name);
    }
    tempFunc = tempFunc.replace('inf', 'Infinity');

    this.setState({
      fullNamesFunc: tempFunc,
      activeAccordionItems: [...this.state.activeAccordionItems, 2],
      showFullNamesFunc: !this.state.showFullNamesFunc,
      showLinkInfoDialog: false
    })
  }


  closeLinkInfoDialog(event) {
    event.stopPropagation();
    
    this.setState({
      showLinkInfoDialog: false
    }); 
  }

  showLinkValuesDialog(event, value) {
    this.setState({
      showLinkValueModal: true,
      viewedValue: value
    });
  }
  handleCloseModal() {
    this.setState({ showLinkValueModal: false });
  }

  toggleValues() {
    this.setState({
      isValuesOpen: !this.state.isValuesOpen
    })
  }

  toggleAssumptions() {
    this.setState({
      isAssumptionsOpen: !this.state.isAssumptionsOpen
    })
  }

  useFM() {
    this.props.handleTextAreaChange({ target: { value: this.state.fmFunc }, 
      stopPropagation: () => {}, 
      preventDefault: () => {}});

  }


  render() {
    return (
      <div>
        <div className="my-profile">
          <h3 className="dilemma-title">My Profile</h3>
        </div>
          <div className="list-item padded-content">
                  <h3>Function</h3>
                  <div>
                      <textarea 
                        className="utility-function"
                        value={this.props.utilFunc}
                        onChange={this.props.handleTextAreaChange}
                      ></textarea> 

                    <div>          
                      <RaisedButton backgroundColor={this.buttonColor} onClick={this.handleShowCalculateFunc.bind(this)}>
                        <div className="button-content">Suggest function</div> 
                      </RaisedButton>
                      
                      <ReactModal 
                        style={this.customStyles}
                        isOpen={this.state.showCalculateFunc}
                        contentLabel="Minimal">
                        <div className="suggestFunction">
                          <h2>Suggested functions</h2>
                          Calculated from your preferred choices
                          <br />
                          <h3>Fourier Motzkin</h3>
                          <br />
                          <div className="preferredFunc">
                            f(x) = {this.state.fmFunc}
                          </div>
                          <br />
                          <RaisedButton backgroundColor={this.buttonColor} onClick={this.useFM}>Use</RaisedButton>
                          <br />
                          <br />
                          <div className="sentiment-modal-separator"></div>
                          <h3>Decision tree</h3>
                          Not implemented yet
                          <br />
                          <br />
                          <div className="sentiment-modal-separator"></div>
                          <h3>Logistic regression</h3>
                          Not implemented yet
                          <br />


                        <br />
                        <RaisedButton backgroundColor={this.buttonColor} onClick={this.handleCloseCalculateFunc.bind(this)}>Close</RaisedButton>
                        </div>
                      </ReactModal>
                    </div>
                  </div>
                  <div>
                    <h3 className="profile-list-header"><span className={this.state.isValuesOpen ? "glyphicon glyphicon-triangle-bottom" : "glyphicon glyphicon-triangle-right"}></span><span onClick={this.toggleValues.bind(this)}> Values</span> <RaisedButton backgroundColor={this.buttonColor} className="show-all-values" onClick={this.props.handleShowAllValues}>
                      <div className="button-content">All Values</div>
                    </RaisedButton>
                    </h3>
                  </div>
                  {this.state.isValuesOpen ? 
                    <div className="values-list">
                    {this.props.rightList.map((item, index) =>
                      <div key={index}>              
                          <div>
                            <li key={index} className="my-list-item">
                              <div className="my-list-item-text">
                                {item.name} ({item.code})
                              </div>

                              <div className="remove-button">
                                <RaisedButton backgroundColor={this.buttonColor} fullWidth={true}  onClick={(e) => this.props.removeRightItem(e, index)}>
                                  <div className="remove-button-content">Remove</div>
                                </RaisedButton>
                              </div> 
                              <div className="remove-button link-button">
                                <RaisedButton backgroundColor={this.buttonColor} fullWidth={true} onClick={(e) => this.showLinkValuesDialog(e, item)}>
                                  <div className="remove-button-content">Link</div>
                                </RaisedButton>
                              </div>
                            </li>
                          </div>
                      
                          {item.selectedLinks.map((link, index2) =>
                            <div className="linked-list-item">
                              <span>{this.props.rightListSlider.filter(v => v.id === link.id)[0].name} ({this.props.rightListSlider.filter(v => v.id === link.id)[0].code})</span>

                              <div className="linked-remove-button">
                                <RaisedButton backgroundColor={this.buttonColor} fullWidth={true} onClick={() => this.props.handleRemoveValueLink(link, item)}>
                                  <div className="remove-button-content">Remove</div>
                                </RaisedButton>
                              </div>
                            </div>
                        )}

                      </div>
                    )}
                    {this.props.rightList.length === 0 ? <span>Empty</span> : ''}
                  </div>
                  : 
                  ''
                }
                  <div>              
                    <h3 onClick={this.toggleAssumptions.bind(this)} className="profile-list-header"><span className={this.state.isAssumptionsOpen ? "glyphicon glyphicon-triangle-bottom" : "glyphicon glyphicon-triangle-right"}></span> Assumptions</h3>
                  </div>
                  {this.state.isAssumptionsOpen ?
                  <div>
                    {this.props.myAssumptions.map((assumption, index) =>
                      <li key={index} className="my-list-item" >
                        <div className="my-list-item-text">
                          {assumption.effect.explanation} ({assumption.option.description}) 
                        </div>
                      </li>
                    )}
                    {this.props.myAssumptions.length === 0 ? <span>Empty</span> : ''}
                  </div>
                  :
                  ''
                }
          </div>


            <ReactModal 
              style={this.props.customStyles}
              isOpen={this.state.showLinkValueModal}
              contentLabel="Test2">
              <div className="link-dialog">
                <h3>Link value</h3>
                {this.state.viewedValue !== null ? 
                <Accordion accordion={false}>
                  {this.state.viewedValue.links.map((link, index2) =>
                    <AccordionItem key={index2}>
                      <AccordionItemTitle>
                        <li key={index2} className="my-list-item" >
                          {this.props.rightListSlider.filter(v => v.id === link.id)[0].name}

                              <div className="remove-button">
                                <RaisedButton backgroundColor={this.buttonColor} fullWidth={true}  onClick={() => this.props.handleChooseValueLink(link, this.state.viewedValue)}>
                                  <div className="remove-button-content">Add</div>
                                </RaisedButton>
                              </div>  
                        </li>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                        <div>
                          {link.details}
                        </div>
                      </AccordionItemBody>
                    </AccordionItem>
                  )}
                </Accordion>
                :
                ''}
                </div>
              <br />
              <br />
              <RaisedButton backgroundColor={this.buttonColor} onClick={this.handleCloseModal}>
                Close
              </RaisedButton>
            </ReactModal>
        </div>
    );
  }

}

export default Profile;