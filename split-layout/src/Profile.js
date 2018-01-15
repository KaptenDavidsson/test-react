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
      functionEditable: false
    }
  }


  handleShowCalculateFunc() {
    this.setState({
      showCalculateFunc: true
    })

    console.log(this.state.myPreferred);

    var preferredMatrix = [];
    for (var preferred of this.state.myPreferred) {
      var preferredArray = [];
      for (var i = 0; i < this.values.length; i++) {
        var value = this.values[i];
        if (preferred.func[value.code]) {
          preferredArray[i] = preferred.func[value.code];
        }
        else {
          preferredArray[i] = 0;
        }
      }
      preferredArray[this.values.length] = -1;
      preferredMatrix.push(preferredArray);
    }

    for (var i = 0; i < this.values.length; i++) {
      var bounds1 = new Array(this.values.length+1).fill(0);
      bounds1[i] = 1;
      bounds1[this.values.length] = 100;
      preferredMatrix.push(bounds1);

      var bounds2 = new Array(this.values.length+1).fill(0);
      bounds2[i] = -1;
      bounds2[this.values.length] = -100;
      preferredMatrix.push(bounds2);
    }

    preferredMatrix = [[1, 0, 7], [0, 1, 1], [-1, 0, -1], [0, -1, -1]];
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
      showFullNamesFunc: !this.state.showFullNamesFunc
    })
  }


  closeLinkInfoDialog(event) {
    event.stopPropagation();
    
    this.setState({
      showLinkInfoDialog: false
    }); 
  }

  render() {
    return (
      <div>
        <div className="my-profile">
          <h1>My Profile</h1>
        </div>
          <div className="list-item padded-content">
            <Accordion accordion={false} activeItems={this.state.activeAccordionItems}>
            <AccordionItem>
                <AccordionItemTitle className="accordion-title">
                  <h3>Function</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>              
                    <div className="flat-button calculate-func" onClick={this.handleShowCalculateFunc.bind(this)}>Calculate a function from my preferred answers</div>
                    
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

                    <div className="flat-button edit-function" onClick={this.handleEditFunction.bind(this)}>{!this.props.functionEditable ? 'Edit' : 'Reset'}</div>
                    <div><Checkbox onCheck={this.handleShowFullFunctionNames.bind(this)} label="Show full names" /></div>
                    
                    {!this.props.showFullNamesFunc ? 
                      <textarea 
                        className={this.props.functionEditable ? "utility-function" : "utility-function utility-function-readonly"} 
                        value={this.props.utilFunc}
                        onChange={this.props.handleTextAreaChange.bind(this)}
                        readOnly={!this.props.functionEditable}
                      ></textarea>
                      :
                      <textarea 
                        className="utility-function utility-function-readonly"
                        value={this.props.fullNamesFunc}
                        readOnly={true}
                      ></textarea>
                  }
                  </div>
                </AccordionItemBody>
              </AccordionItem>
              <AccordionItem className={this.props.functionEditable ? 'inactive-sentiments' : ''}>
                <AccordionItemTitle className="accordion-title">
                  <h3>Sentiments</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>
                    {this.props.sentiments.map((sentiment, index) =>
                      <li key={index} className="list-group-item" >{sentiment.description} <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.props.removeSentiment(e, index)}></span></li>
                    )}
                    {this.props.sentiments.length === 0 ? <span>Empty</span> : ''}
                  </div>
                </AccordionItemBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemTitle className="accordion-title">
                  <h3>Values <span className="flat-button show-all-values" onClick={this.props.handleShowAllValues}>All Values</span></h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>
                    {this.props.rightList.map((item, index) =>
                      <div key={index}>
                          <div className="my-value-item">
                            <div className="value-name">
                              <h4>{item.name} ({item.code})</h4>
                            </div>

                            <div className="values-buttons">
                              <span className="glyphicon glyphicon-link remove-button" onClick={(e) => this.showLinkValuesDialog(e, index)}></span>
                              <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeRightItem(e, index)}></span>
                            </div>

                            <ReactModal 
                              style={this.customStyles}
                              isOpen={this.props.showModal}
                              contentLabel="Test">
                              <div>
                                <h3>Link value</h3>
                                <Accordion accordion={false}>
                                  {item.links.map((link, index2) =>
                                    <AccordionItem key={index}>
                                      <AccordionItemTitle className="accordion-title">
                                        <li key={index} className="sentiment list-group-item list-item-clickable" >{this.props.rightListSlider.filter(v => v.id === link.id)[0].name} <span className="glyphicon glyphicon-plus" onClick={this.props.handleChooseValueLink.bind(this, link, item)}></span></li>
                                      </AccordionItemTitle>
                                      <AccordionItemBody>
                                        <div>
                                          {link.details}
                                        </div>
                                      </AccordionItemBody>
                                    </AccordionItem>
                                  )}
                                </Accordion>
                                </div>
                              <br />
                              <br />
                              <button onClick={this.handleCloseModal}>Close</button>
                            </ReactModal>
                          </div>

                          <ReactModal 
                            style={this.customStyles}
                            isOpen={this.props.showLinkInfoDialog}
                            contentLabel="Minimal">
                            <div>
                              Link info 
                            </div>
                            <br />
                            <button onClick={this.closeLinkInfoDialog.bind(this)}>Close</button>
                          </ReactModal>
                      
                          {item.selectedLinks.map((link, index2) =>
                            <div className="my-value-item derived-value">
                              <div className="value-name">
                                <h4>{this.values.filter(v => v.id === link)[0].name} ({this.values.filter(v => v.id === link)[0].code})</h4>
                              </div>

                              <div className="values-buttons">
                                <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeRightItem(e, index2)}></span>
                              </div>
                            </div>
                        )}

                      </div>
                    )}
                    {this.props.rightList.length === 0 ? <span>Empty</span> : ''}
                  </div>
                </AccordionItemBody>
              </AccordionItem>
              
              <AccordionItem expanded={this.props.isAssumptionsExpanded}>
                <AccordionItemTitle className="accordion-title">
                  <h3>Assumptions</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>
                    {this.props.myAssumptions.map((assumption, index) =>
                      <li key={index} className="list-group-item" >{assumption.effect.explanation} ({assumption.option.description}) <span className="glyphicon glyphicon-remove remove-button"></span></li>
                    )}
                    {this.props.myAssumptions.length === 0 ? <span>Empty</span> : ''}
                  </div>
                </AccordionItemBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemTitle className="accordion-title">
                  <h3 className="my-interests-title">Interests <span className="flat-button show-all-values" onClick={this.props.handleShowAllInterests}>All Interests</span></h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>
                    {this.props.myTags.map((tag, index) =>
                      <li key={index} className="list-group-item" >{this.props.tags.filter(t => t.id === tag)[0].name} <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.props.removeTag(e, index)}></span></li>
                    )}
                    {this.props.myTags.length === 0 ? <span>Empty</span> : ''}
                  </div>
                </AccordionItemBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
    );
  }

}

export default Profile;