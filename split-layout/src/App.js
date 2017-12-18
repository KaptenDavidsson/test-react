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
      rightListSlider: 
      this.values, 
      showModal: false,
      myTags: tags['myTags'],
      ishandleFilterInterestsChecked: false,
      myAssumptions: [],
      showInterestsModel: false,
      functionEditable: false,
      activeAccordionItems: []
    };

    this.interestImageList = ['images/justice.png', 'images/thought-experiment.png'];

    this.handleUtilChange = this.handleUtilChange.bind(this);
    this.handleChooseSentiment = this.handleChooseSentiment.bind(this);
    this.handleClearSentiments = this.handleClearSentiments.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.makeAssumption = this.makeAssumption.bind(this);
    this.onPickInterest = this.onPickInterest.bind(this);

  }

  componentDidMount() {
    const cookies = new Cookies();

    this.setState({
      utilFunc: cookies.get('utilFunc') ? cookies.get('utilFunc') : "",
      rightList: cookies.get('myValues') ? cookies.get('myValues') : [],
    })
    this.handleFilterInterests();
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
   this.setState({
      leftItem: item,
      hideLeft: true
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
    for (var value of this.state.rightListSlider) {
      if (sentiment.func.includes(value.code)) {
        this.setState({
          rightList: [...this.state.rightList, value]
        })
      }
    }    

    this.setState({
      sentiments: [...this.state.sentiments, sentiment],
      activeAccordionItems: [...this.state.activeAccordionItems, 0, 1]
    });
    
    this.setState({
      utilFunc: this.state.utilFunc + sentiment.func
    })
  }

  handleChooseValueLink(link, value) {
    console.log(link);
    console.log(value);

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
      leftItem: this.state.leftList[(this.state.leftList.map(d => d.id).indexOf(this.state.leftItem.id)+1)%this.state.leftList.length]
    });
  }


  handlePreviousDilemma() {
    this.setState({
      leftItem: this.state.leftList[(this.state.leftList.map(d => d.id).indexOf(this.state.leftItem.id)-1+this.state.leftList.length)%this.state.leftList.length]
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

              return myTags.includes(allTags.filter(tt => tt.name.toLowerCase() == t.toLowerCase())[0].id)
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

  makeAssumption(effect) {
    this.setState({
      myAssumptions: [...this.state.myAssumptions, effect]
    });
  }

  handleEditFunction() {
    this.setState({
      functionEditable: true
    })
  }

  handlePickInterests() {
    this.setState({
      showInterestsModel: true
    });
  }

  handleCloseInterestsModal() {
    this.setState({
      showInterestsModel: false,
      leftItem: this.state.leftList[0]
    });
  }

  onPickInterest(tags) {
    this.setState({
      myTags: tags.map(t => this.startingTags[t.value])
    })
  }

  handleShowFullFunctionNames() {
    var tempFunc = this.state.utilFunc;
    for (var value of this.state.rightListSlider) {
      tempFunc = tempFunc.replace(value.code, value.name);
    }
    tempFunc = tempFunc.replace('inf', 'Infinity');

    this.setState({
      utilFunc: tempFunc
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <h3>Ethica 2000</h3>
        </header>
        <div className="wrapper">
          <div className="column-1">
            <button onClick={this.handleToggleLeft.bind(this)} className="show-slider-button">></button>
          </div>
          <div className="column-2">
            <div className="padded-content">
              <div className="dilemma-nav">
                <span className="glyphicon glyphicon-arrow-left last-dilemma" onClick={this.handlePreviousDilemma.bind(this)}></span>
                <div>
                  
                  <ul className="list-inline related">
                    {this.state.leftItem.related.map((item, index) => 
                      <li onClick={this.chooseLeft.bind(this, this.dilemmas.filter(i => i.id == item)[0])} className="list-inline-item list-group-item list-item-clickable">{this.dilemmas.filter(i => i.id == item)[0].name}</li>
                    )}
                  </ul>
                </div>
                <span className="glyphicon glyphicon-arrow-right next-dilemma" onClick={this.handleNextDilemma.bind(this)}></span>
              </div>
              <h1>{this.state.leftItem.name}</h1>              

              <ul className="list-inline">
                {this.state.leftItem.tags.map((item, index) => 
                  <li className="list-inline-item"><span className="glyphicon glyphicon-tag"></span> {item}</li>
                )}
              </ul>
              {this.state.leftItem.description}
              <br />
              {this.state.leftItem.image !== '' ? <img src={'images/' + this.state.leftItem.image} /> : '' }
              <br />
              <br />
              <div> 
                {this.state.leftItem.options.map((option, index) => 
                  <Option 
                    utilFunc={this.state.utilFunc} 
                    option={option} 
                    values={this.state.rightListSlider}
                    maxUtil={Math.max(...this.state.leftItem.options.map(o => o.util))}
                    onUtilChange={this.handleUtilChange}
                    onChooseSentiment={this.handleChooseSentiment}
                    onMakeAssumption={this.makeAssumption}></Option>
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
                    </div>
                  {this.state.leftList.map((item, index) => 
                    <li className="list-group-item list-item-clickable" key={index}>
                      <div className="list-group-item-heading" onClick={this.chooseLeft.bind(this, item)}>
                        <h4>
                          {item.name}  
                        </h4>
                        {item.tags.map((tag, index) => 
                          <span><span className="glyphicon glyphicon-tag"></span> {tag} </span>
                        )}
                      </div>
                    </li>
                  )}

              </div>
            </div>
          </div>

          </div>
          <div className="column-3">
            <button onClick={this.handleToggleRight.bind(this)} className="show-slider-button">></button>
          </div>
          <div className="column-4">
            <div className="list-item padded-content">
              <Accordion accordion={false} activeItems={this.state.activeAccordionItems}>
                <AccordionItem expanded={this.state.isSentimentsExpanded}>
                  <AccordionItemTitle>
                    <h3>My Sentiments <span className="clear-sentiments" onClick={this.handleClearSentiments}>Clear</span></h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.sentiments.map((sentiment, index) =>
                      <li className="list-group-item">{sentiment.description}</li>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    <h3>My values</h3>
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
                                  {item.links.map((link, index2) =>
                                    <li className="sentiment list-group-item list-item-clickable" onClick={this.handleChooseValueLink.bind(this, link, item)}>{this.state.rightListSlider.filter(v => v.id == link)[0].name}</li>
                                  )}
                                </div>
                              <br />
                              <br />
                              <button onClick={this.handleCloseModal}>Close</button>
                            </ReactModal>
                          </div>
                      
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
                    )
}                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem expanded={this.state.isSentimentsExpanded}>
                  <AccordionItemTitle>
                    <h3>My Function <span className="glyphicon glyphicon-edit" onClick={this.handleEditFunction.bind(this)}></span></h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>

                    <div>              
                      (+. -, *, inf supported)
                      <div><input type="checkbox" onChange={this.handleShowFullFunctionNames.bind(this)} />Show full names</div>
                      <button>Calculate a function from my prefered answers</button>
                      <br />
                      <br />
                      <textarea 
                        className="utility-function" 
                        value={this.state.utilFunc}
                        onChange={this.handleTextAreaChange.bind(this)}
                        readOnly={!this.state.functionEditable}
                      ></textarea>
                    </div>
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    <h3>My assumptions</h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.myAssumptions.map((assumption, index) =>
                      <div>
                        {assumption.explanation}
                      </div>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemTitle>
                    <h3>My interests</h3>
                    <button onClick={this.handlePickInterests.bind(this)}>Pick interests</button>
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
                          />
                            <span><input type="checkbox" defaultChecked={this.state.ishandleFilterInterestsChecked} onChange={this.handleFilterInterests.bind(this)} />Set default filter to my interests (can be changed afterwards)</span>
                          </div>
                        <br />
                        <br />
                        <button onClick={this.handleCloseInterestsModal.bind(this)}>Choose</button>
                      </ReactModal>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    {this.state.myTags.map((tag, index) =>
                      <div>
                        {this.tags.filter(t => t.id == tag)[0].name}
                      </div>
                    )}
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </div>
            <div id="slider" className={this.state.hideRight ? "slide-out" : "slide-in"}>
              <div className="slider-content padded-content">
                <input  name="searchbar"
                  type="text"
                  className="form-control search-control searchbar"
                  id="inputTodoTitle"
                  value={this.state.todoTitle}
                  onChange={this.handleInputChange}
                  placeholder="Find">
                </input>
                <div className="list-item">
                  {this.state.rightListSlider.map((item, index) =>
                    <Accordion>
                      <AccordionItem>
                        <AccordionItemTitle>
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
