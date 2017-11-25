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
import myData from './data.json';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = myData;
    this.handleUtilChange = this.handleUtilChange.bind(this);
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
   this.setState({
      rightList: [...this.state.rightList, item],
      hideRight: true
    }) 
  }

  removeRightItem(event, index) {
    event.preventDefault();

    this.setState({
      rightList: this.state.rightList.filter(function(e,i) {
        return i !== index;
      })
    })
  }


  handleTextAreaChange(event) {
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
      <div>
 
      </div>
        </header>
        <div className="wrapper">
          <div className="one">
            <button onClick={this.handleToggleLeft.bind(this)} className="my-button">></button>
          </div>
          <div className="two">
            <div className="padded-content">
              {this.state.leftItem.description}
              <br />
              <br />
              <br />
              {this.state.leftItem.options.map((option, index) => 
                <Option 
                  utilFunc={this.state.utilFunc} 
                  option={option} 
                  maxUtil={Math.max(...this.state.leftItem.options.map(o => o.util))}
                  onUtilChange={this.handleUtilChange}></Option>
              )}
            </div>
            <div id="slider" className={this.state.hideLeft ? "slide-out" : "slide-in"}>
              <div className="list-item padded-content">
                <div className="slider-content">
                  <input  name="todoTitle"
                    type="text"
                    className="form-control search-control"
                    id="inputTodoTitle"
                    value={this.state.todoTitle}
                    onChange={this.handleInputChange}
                    placeholder="Find">
                  </input>
                  {this.state.leftList.map((item, index) => 
                    <li className="list-group-item list-item-clickable" key={index}>
                      <h4 className="list-group-item-heading" onClick={this.chooseLeft.bind(this, item)}>{item.name}</h4>

                    </li>
                  )}

              </div>
            </div>
          </div>

          </div>
          <div className="three">
            <button onClick={this.handleToggleRight.bind(this)} className="my-button">></button>
          </div>
          <div className="four">
            <div className="list-item padded-content">
              {this.state.rightList.map((item, index) =>
                <Accordion>
                  <AccordionItem>
                    <AccordionItemTitle>
                      <div className="list-group-item">
                        <h4>{item.name}<span className="glyphicon glyphicon-remove remove-button" onClick={(e) => this.removeRightItem(e, index)}></span></h4>
                      </div>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                      </p>
                    </AccordionItemBody>
                  </AccordionItem>
                </Accordion>
              )}

              <br />
              Function:
              <br />
              <textarea 
                className="utility-function" 
                text={this.state.utilFunc}
                onChange={this.handleTextAreaChange.bind(this)}
              ></textarea>
            </div>
            <div id="slider" className={this.state.hideRight ? "slide-out" : "slide-in"}>
              <div className="slider-content padded-content">
                <input  name="todoTitle"
                  type="text"
                  className="form-control search-control"
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
                            <h4>{item.name}<span className="glyphicon glyphicon-plus remove-button" onClick={this.addRightItem.bind(this, item)}></span></h4>
                          </div>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
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


class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0
    }
  }

  componentDidUpdate() {
    var vars = {};
    for (var effect of this.props.option.effects) {
      vars[effect.name] = effect.count;
    }

    var formattedUtilFunc = this.props.utilFunc.replace('-', '+-');


    var sum = 0;
    for (var s of formattedUtilFunc.split('+')) {
      var prod = 1;
      if (s == '') continue;

      for (var p of s.split('*')) {
          if (p == '') {
            prod = 0;
            continue;
          }

        if (!vars.hasOwnProperty(p) && !Number.isInteger(Number.parseInt(p))) {
          prod = 0;
        }

        if (p.includes('-')) {
          prod *= -vars[p.replace('-', '')];
        }
        else {
          if (Number.isInteger(Number.parseInt(p))) {
            prod *= p;
          }
          else if (vars.hasOwnProperty(p)) {
            prod *= vars[p];
          }
        }
      }
      sum += prod;
    }

    if (this.props.option.util != sum && Number.isInteger(sum)) {
      this.setState({ counter: 1})

      this.props.onUtilChange({...this.props.option, util: sum});

    }
  }

  render() {
    return (
      <li className="list-group-item list-item-clickable">
        <span  className={this.props.maxUtil <= this.props.option.util ? "glyphicon glyphicon-ok" : ""}></span>  <label>{this.props.option.description}</label>
        {this.props.option.effects.map((effect, index) => 
          <li className="list-group-item list-item-clickable" key={index}>
            <h5 className="list-group-item-heading">{effect.name} = {effect.count}</h5>
          </li>
        )}
        <div>
          Function: {this.props.utilFunc} = {this.props.option.util}
        </div>
      </li>
    );
  }

}


export default App;
