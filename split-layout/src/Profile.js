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

    this.showLinkValuesDialog = this.showLinkValuesDialog.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }


  handleShowCalculateFunc() {
    this.setState({
      showCalculateFunc: true
    })
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


  render() {
    return (
      <div>
        <div className="my-profile">
          <h1>My Profile</h1>
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
                      <RaisedButton onClick={this.handleShowCalculateFunc.bind(this)}>
                        <div className="button-content">Calculate</div> 
                      </RaisedButton>
                      
                      <ReactModal 
                        style={this.customStyles}
                        isOpen={this.props.showCalculateFunc}
                        contentLabel="Minimal">
                        <div>
                          Not implemented yet
                        <br />
                        <button onClick={this.handleCloseCalculateFunc.bind(this)}>Close</button>
                        </div>
                      </ReactModal>
                    </div>
                  </div>
                  <div>
                    <h3 className="profile-list-header"><span onClick={this.toggleValues.bind(this)}>Values</span> <RaisedButton className="show-all-values" onClick={this.props.handleShowAllValues}>
                      <div className="button-content">All Values</div>
                    </RaisedButton>
                    </h3>
                  </div>
                  {this.state.isValuesOpen ? 
                    <div>
                    {this.props.rightList.map((item, index) =>
                      <div key={index}>              
                          <div>
                            <li key={index} className="my-list-item">
                              <div className="my-list-item-text">
                                {item.name} ({item.code})
                              </div>

                              <div className="remove-button">
                                <RaisedButton fullWidth={true}  onClick={(e) => this.props.removeRightItem(e, index)}>
                                  <div className="remove-button-content">Remove</div>
                                </RaisedButton>
                              </div> 
                              <div className="remove-button link-button">
                                <RaisedButton fullWidth={true} onClick={(e) => this.showLinkValuesDialog(e, item)}>
                                  <div className="remove-button-content">Link</div>
                                </RaisedButton>
                              </div>
                            </li>
                          </div>
                      
                          {item.selectedLinks.map((link, index2) =>
                            <div className="my-list-item">
                              <div className="my-list-item-text linked-list-item">
                                <div>{this.props.rightListSlider.filter(v => v.id === link.id)[0].name} ({this.props.rightListSlider.filter(v => v.id === link.id)[0].code})</div>
                              </div>

                              <div className="remove-button">
                                <RaisedButton fullWidth={true} onClick={(e) => this.removeRightItem(e, index2)}>
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
                    <h3 onClick={this.toggleAssumptions.bind(this)} className="profile-list-header">Assumptions</h3>
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
                                <RaisedButton fullWidth={true}  onClick={() => this.props.handleChooseValueLink(link, this.state.viewedValue)}>
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
              <RaisedButton onClick={this.handleCloseModal}>
                Close
              </RaisedButton>
            </ReactModal>
        </div>
    );
  }

}

export default Profile;