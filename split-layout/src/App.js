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
      rightList: [ 
        {name: 'a', description: 'adasd4444444444444444444444444asd'},
        {name: 'b', description: 'adasdasd'},
        {name: 'c', description: 'adasdasd'},
        {name: 'd', description: 'adasdasd'}
      ],
      rightLeft: [ 
        {name: 'a', description: 'adasdasd'},
        {name: 'b', description: 'adasdasd'},
        {name: 'c', description: 'adasdasd'},
        {name: 'd', description: 'adasdasd'}
      ]
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
            <br />
            <br />
            Fusce mattis sem eu felis auctor ornare. Nam condimentum porta sapien. Aliquam erat volutpat. Integer posuere orci quis mauris congue lobortis. Phasellus sit amet imperdiet lacus. Donec hendrerit lectus pretium, vehicula ipsum vitae, sagittis elit. Nullam odio turpis, suscipit in iaculis at, ultrices at mauris. Curabitur imperdiet metus id ultrices euismod. Aenean leo lectus, convallis eget dolor sed, maximus consequat nisl. Ut tempus iaculis vulputate. Nam lorem tellus, cursus quis dignissim ac, dignissim sed mauris.
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.

            <div id="slider" className={this.state.hideLeft ? "slide-out" : "slide-in"}>
              <div className="list-item">
                <div className="slider-content">
                  <input  name="todoTitle"
                    type="text"
                    className="form-control search-control"
                    id="inputTodoTitle"
                    value={this.state.todoTitle}
                    onChange={this.handleInputChange}
                    placeholder="Title">
                  </input>
                <Accordion>
                  <AccordionItem>
                    <AccordionItemTitle>
                      <div className="accordion-item-title">
                        <h4>Simple title</h4>
                      </div>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                      </p>
                    </AccordionItemBody>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionItemTitle>
                      <div className="accordion-item-title">
                        <h4>Title2</h4>
                      </div>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                      </p>
                    </AccordionItemBody>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          </div>
          <div className="three">
            <button onClick={this.handleToggleRight.bind(this)} className="my-button">></button>
          </div>
          <div className="four">
            <div className="list-item">
              <Accordion>
                <AccordionItem>
                  <AccordionItemTitle>
                    <div className="accordion-item-title">
                      <h4>Simple title<span className="glyphicon glyphicon-remove remove-button"></span></h4>
                    </div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                    </p>
                  </AccordionItemBody>
                </AccordionItem>

                <AccordionItem>
                  <AccordionItemTitle>
                    <div className="accordion-item-title">
                      <h4>Title2<span className="glyphicon glyphicon-remove remove-button"></span></h4>
                    </div>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                    </p>
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </div>
            <div id="slider" className={this.state.hideRight ? "slide-out" : "slide-in"}>
              <div className="slider-content">
                <input  name="todoTitle"
                  type="text"
                  className="form-control search-control"
                  id="inputTodoTitle"
                  value={this.state.todoTitle}
                  onChange={this.handleInputChange}
                  placeholder="Title">
                </input>
                <div className="list-item">
                  <Accordion>
                    <AccordionItem>
                      <AccordionItemTitle>
                        <div className="accordion-item-title">
                          <h4>Simple title<span className="glyphicon glyphicon-plus remove-button"></span></h4>
                        </div>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                        </p>
                      </AccordionItemBody>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionItemTitle>
                        <div className="accordion-item-title">
                          <h4>Title2<span className="glyphicon glyphicon-plus remove-button"></span></h4>
                        </div>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus ante sit amet tortor tristique tempor. Quisque pellentesque pretium blandit. Praesent auctor nisl sed vulputate porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce scelerisque purus nibh, non commodo mi cursus ut. Ut ac lorem ligula. Nulla posuere tortor ac nulla ornare aliquam. Duis vestibulum magna neque, vehicula egestas purus venenatis id. In at leo erat. Integer quis varius felis. Sed nec suscipit diam, id consequat nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus volutpat mi diam, in pulvinar nibh scelerisque vel. Curabitur eu euismod sem. Nunc elementum vel nisi ut semper. Fusce et finibus magna.
                        </p>
                      </AccordionItemBody>
                    </AccordionItem>
                  </Accordion>
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
