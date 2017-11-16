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


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideRight: true,
      hideLeft: true,
      leftList: [
        { 
          name: 'sdfsdfsdf',
          description: ' tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.',
          options: [
            { description: 'dfdsfdsf', effects: [{ name: 'a', count: 3}]},
            { description: 'dfdsfdsf', effects: [{ name: 'a', count: 1}]}
          ]
        },
        {name: 'a', description: 'At least 510 people were reported to have died and more than 7,000 others were injured.[14][21] In Sarpol-e Zahab, the hospital was damaged and at least 142 people were killed, many who had lived in social housing complexes built by former president Mahmoud Ahmadinejad.[9][8][17] At least seven people were killed and another 500 injured in neighbouring Iraq, according to officials in Iraqi Kurdistan.[22][23] Further damages are possible due to the threat of landslides, favoured by the shallow depth of the earthquak'},
        {name: 'b', description: 'adasdasd'},
        {name: 'c', description: 'adasdasd'},
        {name: 'd', description: 'adasdasd'}
      ],
      rightList: [ 
        {name: 'a', description: 'adasd4444444444444444444444444asd'},
        {name: 'b', description: 'adasdasd'},
        {name: 'c', description: 'adasdasd'},
        {name: 'd', description: 'adasdasd'}
      ],
      rightListSlider: [ 
        {name: '1', description: 'adasd4444444444444444444444444asd'},
        {name: '2', description: 'adasdasd'},
        {name: '3', description: 'adasdasd'},
        {name: '4', description: 'adasdasd'}
      ], 
      leftItem: { 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.',
        options: [
          { description: 'dfdsfdsf', effects: [{ name: 'a', count: 3}]},
          { description: 'dfdsfdsf', effects: [{ name: 'a', count: 1}]}
        ]
      },
      rightItem: {}
    };
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
              {this.state.leftItem.options.map((option, index) => 
                  <li className="list-group-item list-item-clickable" key={index}>
                    <div class="radio">
                      <label><input type="radio" name="optradio"></input>{option.description}</label>
                    </div>
                      {option.effects.map((effect, index) => 
                        <li className="list-group-item list-item-clickable" key={index}>
                          <h5 className="list-group-item-heading">{effect.name} {effect.count}</h5>
                        </li>
                      )}

                  </li>
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
              <textarea></textarea>
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

export default App;
