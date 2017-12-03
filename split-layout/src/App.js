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
import Cookies from 'universal-cookie';
import Option from './Option.js'


class App extends Component {
  constructor(props) {
    super(props);

    this.values = values['values'];
    this.dilemmas = dilemmas['dilemmas']

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


    this.state = {...defaultState, leftItem: this.dilemmas[0], leftList: this.dilemmas, rightListSlider: this.values};

    this.handleUtilChange = this.handleUtilChange.bind(this);
    this.handleChooseSentiment = this.handleChooseSentiment.bind(this);
    this.handleClearSentiments = this.handleClearSentiments.bind(this);
  }

  componentDidMount() {
    const cookies = new Cookies();

    this.setState({
      utilFunc: cookies.get('utilFunc') ? cookies.get('utilFunc') : "",
      rightList: cookies.get('myValues') ? cookies.get('myValues') : [],
    })
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


  handleTextAreaChange(event) {
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
    this.setState({
      sentiments: [...this.state.sentiments, sentiment]
    });
    
    this.setState({
      utilFunc: this.state.utilFunc + sentiment.func
    })

  }

  handleClearSentiments() {
    this.setState({
      sentiments: []
    });
    
    this.setState({
      utilFunc: ''
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
              <ul className="list-inline">
                {this.state.leftItem.related.map((item, index) => 
                  <li onClick={this.chooseLeft.bind(this, this.dilemmas.filter(i => i.id == item)[0])} className="list-inline-item list-group-item list-item-clickable">{this.dilemmas.filter(i => i.id == item)[0].name}</li>
                )}
              </ul>
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
                    onChooseSentiment={this.handleChooseSentiment}></Option>
                )}
              </div>
              {/*}
              <div className="example-util-funcs">
                <h4>Example util functions</h4>
                {this.state.leftItem.exampleUtilFuncs.map((item,index) =>
                  <p>{item}</p>
                )}
              </div>
            */}
            </div>
            <div id="slider" className={this.state.hideLeft ? "slide-out" : "slide-in"}>
              <div className="list-item padded-content">
                <div className="slider-content">
                  <input  name="searchbar"
                    type="text"
                    className="form-control search-control searchbar"
                    id="inputTodoTitle"
                    value={this.state.searchLeft}
                    onChange={this.handleSearchLeft.bind(this)}
                    placeholder="Find">
                  </input>
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
              <h1>My Sentiments <span className="clear-sentiments" onClick={this.handleClearSentiments}>Clear</span></h1>
              
                {this.state.sentiments.map((sentiment, index) =>
                  <li className="list-group-item">{sentiment.description}</li>
                )}
              <h1>My values</h1>
              {this.state.rightList.map((item, index) =>
                <Accordion>
                  <AccordionItem>
                    <AccordionItemTitle>
                      <div className="list-group-item">
                        <h4>{item.name} ({item.code})<span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeRightItem(e, index)}></span></h4>
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

              <br />
              Function (+. -, *, inf supported):
              <br />
              <textarea 
                className="utility-function" 
                value={this.state.utilFunc}
                onChange={this.handleTextAreaChange.bind(this)}
              ></textarea>
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
        <footer className="App-footer">
        </footer>
      </div>
    );
  }
}

export default App;
