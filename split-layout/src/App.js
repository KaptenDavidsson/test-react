import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css'; 
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import '../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css';
import values from './values.json';
import dilemmas from './dilemmas.json';
import tags from './tags.json';
import Cookies from 'universal-cookie';
import Option from './Option.js'
import ReactDom from 'react-dom';
import ReactModal from 'react-modal';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'


class App extends Component {
  constructor(props) {
    super(props);

    this.values = values['values'];
    this.dilemmas = dilemmas['dilemmas'];
    this.tags = tags['tags'];
    this.startingTags = tags['startingTags'];

    var defaultState = {
      "hideRight": true,
      "hideLeft": true,
      "leftList": [],
      "rightList": [],
      "rightListSlider": [],
      "utilFunc": "",
      "leftItem": {},
      "rightItem": {},
      "sentiments": []
    }

    var modalOverlayStyle = {
        position          : 'fixed',
        top               : '60px',
        left              : 0,
        right             : 0,
        bottom            : '60px',
        backgroundColor   : 'rgba(255, 255, 255, 0.50)'
    }

    this.customStyles = {
      overlay : modalOverlayStyle,
      content : {
        top                   : '25%',
        left                  : '75%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    this.chooseInterestsStyles = {
      overlay : modalOverlayStyle,
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    this.state = {
      ...defaultState, 
      leftItem: this.dilemmas[0], 
      leftList: this.dilemmas, 
      rightListSlider: this.values, 
      showModal: false,
      myTags: tags['myTags'],
      ishandleFilterInterestsChecked: false,
      myAssumptions: [],
      showInterestsModel: false,
      functionEditable: false,
      activeAccordionItems: [],
      myPreferred: [],
      fullNamesFunc: '',
      showFullNamesFunc: false
    };

    this.interestImageList = ['images/justice.png', 'images/thought-experiment.png'];

    this.handleUtilChange = this.handleUtilChange.bind(this);
    this.handleChooseSentiment = this.handleChooseSentiment.bind(this);
    this.handleClearSentiments = this.handleClearSentiments.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.makeAssumption = this.makeAssumption.bind(this);
    this.onPickInterest = this.onPickInterest.bind(this);
    this.handleChoosePreferred = this.handleChoosePreferred.bind(this);

  }

  componentDidMount() {
    const cookies = new Cookies();

    this.setState({
      utilFunc: cookies.get('utilFunc') ? cookies.get('utilFunc') : "",
      rightList: cookies.get('myValues') ? cookies.get('myValues') : [],
      sentiments: cookies.get('mySentiments') ? cookies.get('mySentiments') : []
    })
    this.handleFilterInterests();
    
    if (window.location.href.includes('#')) {
      var dilemmaRoute = window.location.href.split('/#/')[1];
      this.chooseLeft(this.dilemmas.filter(d => d.id == dilemmaRoute)[0]);
    }
    else {
      this.chooseLeft(this.dilemmas[0]);
    }
  }

  handleToggleRight() {
    this.setState({
      hideRight: !this.state.hideRight
    })
  }

  handleToggleLeft() {
    this.setState({
      hideLeft: !this.state.hideLeft
    })
  }

  chooseLeft(item) {
    window.location.href = window.location.href.split('#')[0] + "#/" + item.id;
    this.setState({
      leftItem: item,
      hideLeft: true,
    }) 
  }

  addRightItem(item) {
    var newList = [...this.state.rightList, item];

    const cookies = new Cookies();
    cookies.set('myValues', newList, { path: '/' });

   this.setState({
      rightList: newList,
      hideRight: true
    }) 
  }

  removeRightItem(event, index) {
    event.preventDefault();

    var newList = this.state.rightList.filter(function(e,i) {
        return i !== index;
      });

    const cookies = new Cookies();
    cookies.set('myValues', newList, { path: '/' });

    this.setState({
      rightList: newList
    })
  }

  removeSentiment(event, index) {
    event.preventDefault();

    var newList = this.state.sentiments.filter(function(e,i) {
        return i !== index;
      });

    const cookies = new Cookies();
    cookies.set('mySentiments', newList, { path: '/' });

    this.setState({
      sentiments: newList
    })
  }

  showLinkValuesDialog(event, index) {
    this.setState({
      showModal: true
    });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleTextAreaChange(event) {
    event.stopPropagation();
    event.preventDefault();

    const cookies = new Cookies();
    cookies.set('utilFunc', event.target.value, { path: '/' });

   this.setState({
      utilFunc: event.target.value
    })
  }

  handleUtilChange(option) { 
    this.setState(prevState => ({
      leftItem: {
        ...prevState.leftItem,
        options: prevState.leftItem.options.map(o => o.description == option.description ? option : o)
      } 
    }));
  }

  handleSearchLeft(event) {
    event.preventDefault();

    const target = event.target;
    const value =  target.value;

    this.setState({
      leftList: this.dilemmas.filter(function(d,i) {
        return d.name.toLowerCase().includes(value.toLowerCase()) || 
          d.tags.some(function(t) { 
            return t.toLowerCase().includes(value.toLowerCase()) 
          });
      })
    });
  }

  handleChooseSentiment(sentiment) {
    const cookies = new Cookies();

    for (var value of this.state.rightListSlider) {
      if (sentiment.func.includes(value.code) && !this.state.rightList.some(v => v == value)) {

        var newValues = [...this.state.rightList, value];
        cookies.set('myValues', newValues, { path: '/' });

        this.setState({
          rightList: newValues
        })
      }
    }    

    var newSentiments = [...this.state.sentiments, sentiment];
    cookies.set('mySentiments', newSentiments, { path: '/' });

    this.setState({
      sentiments: newSentiments,
      activeAccordionItems: [...this.state.activeAccordionItems, 0, 1]
    });
    
    var newFunc = this.state.utilFunc + '+' + sentiment.func;
    cookies.set('utilFunc', newFunc, { path: '/' });

    this.setState({
      utilFunc: newFunc
    })
  }

  handleChooseValueLink(link, value) {
    this.setState(prevState => ({
      rightList: prevState.rightList.map(v => v.id == value.id ? { ...v, selectedLinks: [...v.selectedLinks, link] } : v)
    }));
  }

  handleClearSentiments() {
    this.setState({
      sentiments: []
    });
    
    this.setState({
      utilFunc: ''
    })
  }


  handleNextDilemma() {
    this.setState({
      leftItem: this.getNextDilemma()
    });
  }

  getPreviousDilemma() {
    return this.state.leftList[(this.state.leftList.map(d => d.id).indexOf(this.state.leftItem.id)-1+this.state.leftList.length)%this.state.leftList.length];
  }

  getNextDilemma() {
    return this.state.leftList[(this.state.leftList.map(d => d.id).indexOf(this.state.leftItem.id)+1)%this.state.leftList.length];
  }


  handlePreviousDilemma() {
    this.setState({
      leftItem: this.getPreviousDilemma()
    });
  }

  handleFilterInterests() {
    var myTags = this.state.myTags;
    var allTags = this.tags;

    if (!this.state.ishandleFilterInterestsChecked) {
      this.setState({
        leftList: this.dilemmas.filter(function(d,i) {
          return d.tags.some(function(t) {
              if (t.length == 0) {
                return false;
              }

              return myTags.includes(allTags.filter(tt => tt.id == t)[0].id)
            });
        })
      });
    }
    else {
      this.setState({
        leftList: this.dilemmas
      });
    }
    this.setState({
      ishandleFilterInterestsChecked: !this.state.ishandleFilterInterestsChecked
    });
  }

  makeAssumption(effect, option) {

    if (!this.state.myAssumptions.some(a => a.effect.id == effect.id)) {
      this.setState({
        myAssumptions: [...this.state.myAssumptions, { effect: effect, option: option} ],
        activeAccordionItems: [...this.state.activeAccordionItems, 3],
      });
    } 
    else {
      this.setState({
        myAssumptions: this.state.myAssumptions.filter( (a,i) => i !== this.state.myAssumptions.map(a => a.effect).indexOf(effect)),
        activeAccordionItems: [...this.state.activeAccordionItems, 3],
      });
    }
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

  handlePickInterests(event) {
    event.stopPropagation();

    this.setState({
      showInterestsModel: true,
    });
  }

  handleCloseInterestsModal(event) {
    event.stopPropagation();

    this.setState({
      showInterestsModel: false,
      leftItem: this.state.leftList[0]
    });

    if (!this.state.activeAccordionItems.some(a => a == 4)) {
      this.setState({
        activeAccordionItems: [...this.state.activeAccordionItems, 4]
      });
    }
  }

  onPickInterest(tags) {
    this.setState({
      myTags: tags.map(t => this.startingTags[t.value])
    })
  }

  onClickInterest(event) {
    event.stopPropagation();
  }

  handleShowFullFunctionNames() {
    var tempFunc = this.state.utilFunc;
    for (var value of this.state.rightListSlider) {
      tempFunc = tempFunc.replace(value.code, value.name);
    }
    tempFunc = tempFunc.replace('inf', 'Infinity');

    this.setState({
      fullNamesFunc: tempFunc,
      activeAccordionItems: [...this.state.activeAccordionItems, 2],
      showFullNamesFunc: !this.state.showFullNamesFunc
    })
  }


  handleAddDilemma(event) {
    event.stopPropagation();

    this.setState({
      showAddDilemmaModal: true
    }); 
  }

  handleCloseAddDilemma(event) {
    event.stopPropagation();
    
    this.setState({
      showAddDilemmaModal: false
    }); 
  }

  showLinkInfoDialog(event, link) {
    event.stopPropagation();
    
    this.setState({
      showLinkInfoDialog: true
    }); 
  }

  closeLinkInfoDialog(event) {
    event.stopPropagation();
    
    this.setState({
      showLinkInfoDialog: false
    }); 
  }

  handleChoosePreferred(preferred) {
    console.log(this.state.myPreferred);

    if (!this.state.myPreferred.some(p => p == preferred)) {
      this.setState({
        myPreferred: [...this.state.myPreferred, preferred ],
      });
    } 
    else {
      this.setState({
        myPreferred: this.state.myPreferred.filter( (a,i) => i !== this.state.myPreferred.indexOf(preferred)),
      });
    }
  }

  handleShowCalculateFunc() {
    this.setState({
      showCalculateFunc: true
    })
  }

  handleCloseCalculateFunc() {
    this.setState({
      showCalculateFunc: false
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <h2 className="header-title">Ethica 2000</h2>
            <button onClick={this.handleToggleLeft.bind(this)} className="show-all-dilemmas">{this.state.hideLeft ? "Show all dilemmas" : "Hide all dilemmas"}</button>
        </header>
        <div className="wrapper">
          <div className="column-1">
            <div className="padded-content">
              <div className="dilemma-nav">
                <div className="previousDilemma" onClick={this.handlePreviousDilemma.bind(this)}>
                  <span className="glyphicon glyphicon-arrow-left left-arrow"></span>
                  <span>{this.getPreviousDilemma().name}</span>
                </div>
                <h1 className="dilemma-title">{this.state.leftItem.name}</h1>

                <div className="previousDilemma" onClick={this.handleNextDilemma.bind(this)}>
                  <span>{this.getNextDilemma().name}</span>
                  <span className="glyphicon glyphicon-arrow-right right-arrow"></span>
                </div>              
              </div>

                <div>
                <ul className="list-inline tags">
                  {this.state.leftItem.tags.map((item, index) => 
                    <li className="list-inline-item"><span className="glyphicon glyphicon-tag"></span> {this.tags.filter(t => t.id == item)[0].name}</li>
                  )}
                </ul>
                </div>
              <div>
                  <span className="related related-text">Related:</span>
                  <ul className="list-inline related">
                    {this.state.leftItem.related.map((item, index) => 
                      <li onClick={this.chooseLeft.bind(this, this.dilemmas.filter(i => i.id == item)[0])} className="related-element">{this.dilemmas.filter(i => i.id == item)[0].name}</li>
                    )}
                  </ul>
              </div>
              <div>
              </div>
              {this.state.leftItem.description}
              <br />
              {this.state.leftItem.image ? <img src={'images/' + this.state.leftItem.image} /> : '' }
              <br />
              <br />
              <div> 
                {this.state.leftItem.options.map((option, index) => 
                  <Option 
                    utilFunc={this.state.utilFunc} 
                    option={option} 
                    values={this.state.rightListSlider}
                    maxUtil={Math.max(...this.state.leftItem.options.map(o => o.util))}
                    allUtilSame={this.state.leftItem.options.map(o => o.util).every(u => u === this.state.leftItem.options.map(o => o.util)[0])}
                    myAssumptions={this.state.myAssumptions}
                    mySentiments={this.state.sentiments}
                    myPreferred={this.state.myPreferred}
                    onUtilChange={this.handleUtilChange}
                    onChooseSentiment={this.handleChooseSentiment}
                    onMakeAssumption={this.makeAssumption}
                    handleChoosePreferred={this.handleChoosePreferred}></Option>
                )}
              </div>

            </div>
            <div id="slider" className={this.state.hideLeft ? "slide-out" : "slide-in"}>
              <div className="list-item padded-content">
                <div className="slider-content">
                  <div>
                    <input  name="searchbar"
                      type="text"
                      className="form-control search-control searchbar"
                      id="inputTodoTitle"
                      value={this.state.searchLeft}
                      onChange={this.handleSearchLeft.bind(this)}
                      placeholder="Find">
                    </input>
                    <span><input type="checkbox" checked={this.state.ishandleFilterInterestsChecked} defaultChecked={this.state.ishandleFilterInterestsChecked} onChange={this.handleFilterInterests.bind(this)} />Show only my interests</span>
                    
                    <p className="add-dilemma" onClick={this.handleAddDilemma.bind(this)}>
                      <span className="glyphicon glyphicon-plus-sign"></span> Add
                    </p>

                    <ReactModal 
                      style={this.customStyles}
                      isOpen={this.state.showAddDilemmaModal}
                      contentLabel="Minimal">
                      <div>
                        Add not suppored yet. Mail your suggestion to kaptendavidsson@yahoo.se. 
                      </div>
                      <br />
                      <button onClick={this.handleCloseAddDilemma.bind(this)}>Close</button>
                    </ReactModal>
                  </div>
                  {this.state.leftList.map((item, index) => 
                    <li className="list-group-item list-item-clickable" key={index}>
                      <div className="list-group-item-heading" onClick={this.chooseLeft.bind(this, item)}>
                        <h4>
                          {item.name}  
                        </h4>
                        {item.tags.map((tag, index) => 
                          <span><span className="glyphicon glyphicon-tag"></span> {this.tags.filter(t => t.id == tag)[0].name} </span>
                        )}
                      </div>
                    </li>
                  )}

              </div>
            </div>
          </div>

          </div>
          <div className="column-2">

            {/*
            <button onClick={this.handleToggleRight.bind(this)} className="show-slider-button"><span className={this.state.hideRight ? "glyphicon glyphicon-menu-right" : "glyphicon glyphicon-menu-left"}></span></button>
            */}
          </div>
          <div className="column-3">
            <div className="my-profile">
              <h1>My Profile</h1>
            </div>
            <div className="list-item padded-content">
              <Accordion accordion={false} activeItems={this.state.activeAccordionItems}>
                <AccordionItem className={this.state.functionEditable ? 'inactive-sentiments' : ''}>
                  <AccordionItemTitle className="accordion-title">
                    <h3>Sentiments</h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.sentiments.map((sentiment, index) =>
                      <li className="list-group-item" >{sentiment.description} <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeSentiment(e, index)}></span></li>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle className="accordion-title">
                    <h3>Values</h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.rightList.map((item, index) =>
                      <div>
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
                              isOpen={this.state.showModal}
                              contentLabel="Test">
                              <div>
                                <h3>Link value</h3>
                                <Accordion accordion={false}>
                                  {item.links.map((link, index2) =>
                                    <AccordionItem>
                                      <AccordionItemTitle className="accordion-title">
                                        <li className="sentiment list-group-item list-item-clickable" >{this.state.rightListSlider.filter(v => v.id == link.id)[0].name} <span className="glyphicon glyphicon-plus" onClick={this.handleChooseValueLink.bind(this, link, item)}></span></li>
                                      </AccordionItemTitle>
                                      <AccordionItemBody>
                                        {link.details}
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
                            isOpen={this.state.showLinkInfoDialog}
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
                                <h4>{this.values.filter(v => v.id == link)[0].name} ({this.values.filter(v => v.id == link)[0].code})</h4>
                              </div>

                              <div className="values-buttons">
                                <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeRightItem(e, index2)}></span>
                              </div>
                            </div>
                        )}
                        </div>
                    )}                  
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle className="accordion-title">
                    <h3>Function</h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <div>              
                      <div className="calculate-func" onClick={this.handleShowCalculateFunc.bind(this)}>Calculate a function from my preferred answers</div>
                      
                      <ReactModal 
                        style={this.customStyles}
                        isOpen={this.state.showCalculateFunc}
                        contentLabel="Minimal">
                        <div>
                          Not implemented yet
                        </div>
                        <br />
                        <button onClick={this.handleCloseCalculateFunc.bind(this)}>Close</button>
                      </ReactModal>

                      <div><input type="checkbox" onChange={this.handleShowFullFunctionNames.bind(this)} />Show full names</div>
                      <span className="edit-function" onClick={this.handleEditFunction.bind(this)}>{!this.state.functionEditable ? 'edit' : 'reset'}</span>
                      
                      {!this.state.showFullNamesFunc ? 
                        <textarea 
                          className={this.state.functionEditable ? "utility-function" : "utility-function utility-function-readonly"} 
                          value={this.state.utilFunc}
                          onChange={this.handleTextAreaChange.bind(this)}
                          readOnly={!this.state.functionEditable}
                        ></textarea>
                        :
                        <textarea 
                          className="utility-function utility-function-readonly"
                          value={this.state.fullNamesFunc}
                          readOnly={true}
                        ></textarea>
                    }
                    </div>
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem expanded={this.state.isAssumptionsExpanded}>
                  <AccordionItemTitle className="accordion-title">
                    <h3>Assumptions</h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.myAssumptions.map((assumption, index) =>
                      <li className="list-group-item" >{assumption.effect.explanation} ({assumption.option.description}) <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeSentiment(e, index)}></span></li>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle className="accordion-title">
                    <h3 className="my-interests-title">Interests <p className="pick-interests" onClick={this.handlePickInterests.bind(this)}>Pick interests</p></h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <ReactModal 
                      style={this.chooseInterestsStyles}
                      isOpen={this.state.showInterestsModel}
                      contentLabel="Minimal Modal">
                      <div>
                        <h3>Choose interests</h3>
                        <ImagePicker 
                          images={this.startingTags.map((tag, i) => ({src: 'images/' + this.tags[tag].image, value: i}))}
                          onPick={this.onPickInterest}
                          multiple={true}
                          onClick={this.onClickInterest.bind(this)}
                        />
                          <span><input type="checkbox" defaultChecked={this.state.ishandleFilterInterestsChecked} onChange={this.handleFilterInterests.bind(this)} />Set default filter to my interests (can be changed afterwards)</span>
                        </div>
                      <br />
                      <br />
                      <button onClick={this.handleCloseInterestsModal.bind(this)}>Choose</button>
                    </ReactModal>
                    {this.state.myTags.map((tag, index) =>
                      <li className="list-group-item" >{this.tags.filter(t => t.id == tag)[0].name} <span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeSentiment(e, index)}></span></li>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </div>
            <div id="slider" className={this.state.hideRight ? "slide-out" : "slide-in"}>
              <div className="slider-content padded-content">
                <div className="list-item">
                  {this.state.rightListSlider.map((item, index) =>
                    <Accordion>
                      <AccordionItem>
                        <AccordionItemTitle className="accordion-title">
                          <div className="list-group-item list-item-clickable">
                            <h4>{item.name} ({item.code})<span className="glyphicon glyphicon-plus remove-button" onClick={this.addRightItem.bind(this, item)}></span></h4>
                          </div>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                          <p>
                            {item.description}
                          </p>
                        </AccordionItemBody>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
