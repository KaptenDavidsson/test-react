import React, { Component } from 'react';
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
import Profile from './Profile.js'
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
    ReactModal.setAppElement('body');

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
        options: prevState.leftItem.options.map(o => o.description === option.description ? option : o)
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
      if (sentiment.func.includes(value.code) && !this.state.rightList.some(v => v.code === value.code)) {

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
      rightList: prevState.rightList.map(v => v.id === value.id ? { ...v, selectedLinks: [...v.selectedLinks, link] } : v)
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
              if (t.length === 0) {
                return false;
              }

              return myTags.includes(allTags.filter(tt => tt.id === t)[0].id)
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

    if (!this.state.myAssumptions.some(a => a.effect.id === effect.id)) {
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

    if (!this.state.activeAccordionItems.some(a => a === 4)) {
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


  handleChoosePreferred(preferredOption) {

    var preferred =  { preferredOption: preferredOption, dilemmaId: this.state.leftItem.id }
    if (!this.state.myPreferred.some(
        p => p.preferredOption.description === preferred.preferredOption.description 
        && p.dilemmaId === preferred.dilemmaId)) {
      
      var myPreferred = this.state.myPreferred.filter(p => p.dilemmaId !== this.state.leftItem.id);

      var func = {};
      for (var i=0; i < this.values.length; i++) {
        var value = this.values[i];
        var preferredEffect = preferred.preferredOption.effects.filter(e => e.code === value.code);
        if (preferredEffect.length > 0) {
          func[value.code] = -preferredEffect[0].count;
        }
        else {
          func[value.code] = 0;
        }

        var otherOption = this.state.leftItem.options.filter(o => o.description !== preferred.preferredOption.description)[0];
  
        var otherEffect = otherOption.effects.filter(e => e.code === value.code);
        if (otherEffect.length > 0) {
          func[value.code] += otherEffect[0].count;
        }
      }

      preferred.func = func;

      this.setState({
        myPreferred: [...myPreferred, preferred],
      });
    } 
    else {
      this.setState({
        myPreferred: this.state.myPreferred.filter(p => 
          p.preferredOption.description !== preferred.preferredOption.description 
          && p.dilemmaId !== preferred.dilemmaId)
      });
    }
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="header-title">Ethica 2000</h2>
          <div onClick={this.handleToggleLeft.bind(this)} className="flat-button show-all-dilemmas">{this.state.hideLeft ? "Show all dilemmas" : "Hide all dilemmas"}</div>
          <span className="flat-button pick-interests" onClick={this.handlePickInterests.bind(this)}>Start screen</span>
          <ReactModal 
            style={this.chooseInterestsStyles}
            isOpen={this.state.showInterestsModel}
            contentLabel="Minimal Modal">
            <div className="interestes-picker">
              <button onClick={this.handleCloseInterestsModal.bind(this)} className="close-interests-modal">X</button>

              <h3>Choose interests</h3>
              <ImagePicker 
                images={this.startingTags.map((tag, i) => ({src: 'images/' + this.tags[tag].image, value: i}))}
                onPick={this.onPickInterest}
                multiple={true}
                onClick={this.onClickInterest.bind(this)}
              />
                <span><input type="checkbox" defaultChecked={this.state.ishandleFilterInterestsChecked} onChange={this.handleFilterInterests.bind(this)} />Set default filter to my interests (can be changed afterwards)</span>
              
                <div className="sentiment-modal-separator"></div>
                <br />

                This application lets you find out, organize and discuss your values and assumptions and a systematic manner. 
                Browse the ethical dilemmas on the left and decide what action you find most ethical. 
                You can either modify your value function on the right manually to make it fit the action (it will then turn green) 
                or click the action to get help to align your value function with this action. 

              </div>
            <br />
            <br />
            <button onClick={this.handleCloseInterestsModal.bind(this)}>Choose</button>
          </ReactModal>
        </header>
        <div className="wrapper">
          <div className="column-1">
            <div className="padded-content">
              <div className="dilemma-nav">
                <div className="flat-button next-dilemma" onClick={this.handlePreviousDilemma.bind(this)}>
                  <span className="glyphicon glyphicon-arrow-left left-arrow"></span>
                  <span>{this.getPreviousDilemma().name}</span>
                </div>
                <h1 className="dilemma-title">{this.state.leftItem.name}</h1>

                <div className="flat-button next-dilemma" onClick={this.handleNextDilemma.bind(this)}>
                  <span>{this.getNextDilemma().name}</span>
                  <span className="glyphicon glyphicon-arrow-right right-arrow"></span>
                </div>              
              </div>

                <div>
                <ul className="list-inline tags">
                  {this.state.leftItem.tags.map((item, index) => 
                    <li className="list-inline-item" key={index}><span className="glyphicon glyphicon-tag"></span> {this.tags.filter(t => t.id === item)[0].name}</li>
                  )}
                </ul>
                </div>
              <div>
                  <span className="related related-text">Related:</span>
                  <ul className="list-inline related">
                    {this.state.leftItem.related.map((item, index) => 
                      <li onClick={this.chooseLeft.bind(this, this.dilemmas.filter(i => i.id === item)[0])} className="flat-button related-element" key={index}>{this.dilemmas.filter(i => i.id === item)[0].name}</li>
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
                    key={index}
                    utilFunc={this.state.utilFunc} 
                    option={option} 
                    values={this.state.rightListSlider}
                    maxUtil={Math.max(...this.state.leftItem.options.map(o => o.util))}
                    allUtilSame={this.state.leftItem.options.map(o => o.util).every(u => u === this.state.leftItem.options.map(o => o.util)[0])}
                    myAssumptions={this.state.myAssumptions}
                    mySentiments={this.state.sentiments}
                    myPreferred={this.state.myPreferred}
                    dilemmaId={this.state.leftItem.id}
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
                    
                  </div>
                  {this.state.leftList.map((item, index) => 
                    <li className="dilemma" key={index}>
                      <div onClick={this.chooseLeft.bind(this, item)} className="dilemma-feed-element">
                        <h4 className="dilemma-feed-header">
                          {item.name}  
                        </h4>
                        <ul className="list-inline">
                          {item.tags.map((tag, index) => 
                            <li key={index}><span className="glyphicon glyphicon-tag"></span> {this.tags.filter(t => t.id === tag)[0].name} </li>
                          )}
                        </ul>
                        {item.description.substr(0, 200)}...
                      </div>
                    </li>
                  )}

              </div>
            </div>
          </div>

          </div>
          <div className="column-2">
          </div>
          <div className="column-3">
            <Profile
              handleTextAreaChange={this.handleTextAreaChange}
              sentiments={this.state.sentiments}
              handleToggleRight={this.handleToggleRight}
              rightList={this.state.rightList}
              myAssumptions={this.state.myAssumptions}
              myTags={this.state.myTags}
              tags={this.tags}
              rightListSlider={this.state.rightListSlider}
              handleChooseValueLink={this.handleChooseValueLink}
            ></Profile>
          <div id="slider" className={this.state.hideRight ? "slide-out" : "slide-in"}>
            <div className="slider-content padded-content">
              <div>
                <span className="show-all-values" onClick={this.handleToggleRight.bind(this)}>Close</span>
                <Accordion>
                  {this.state.rightListSlider.map((item, index) =>
                    <AccordionItem key={index}>
                      <AccordionItemTitle className="accordion-title">
                        <div>
                          <h4>{item.name} ({item.code})<span className="glyphicon glyphicon-plus remove-button" onClick={this.addRightItem.bind(this, item)}></span></h4>
                        </div>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                        <p>
                          {item.description}
                        </p>
                      </AccordionItemBody>
                    </AccordionItem>
                  )}
                </Accordion>
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
