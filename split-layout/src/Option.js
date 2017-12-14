import React, { Component } from 'react';
import './Option.css'; 
import ReactDom from 'react-dom';
import ReactModal from 'react-modal';


class Option extends Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false, showFunc: false };

    this.customStyles = {
      overlay : {
        position          : 'fixed',
        top               : '60px',
        left              : 0,
        right             : 0,
        bottom            : '60px',
        backgroundColor   : 'rgba(255, 255, 255, 0.50)'
      },
      content : {
        top                   : '50%',
        left                  : '25%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidUpdate() {
    var vars = {};
    for (var effect of this.props.option.effects) {
      vars[effect.code] = effect.count;
    }

    var formattedUtilFunc = this.props.utilFunc.replace(/-/g, '+-');

    var sum = 0;
    for (var s of formattedUtilFunc.split('+')) {
      var prod = 1;
      if (s == '') continue;

      for (var p of s.split('*')) {
          if (p == '') {
            prod = 0;
            continue;
          }
        if (!vars.hasOwnProperty(p.replace('-', '')) && !Number.isInteger(Number.parseInt(p)) && p != 'inf') {
          ;prod = 0;
        }

        if (p.includes('-') && !Number.isInteger(Number.parseInt(p)) && vars.hasOwnProperty(p.replace('-', ''))) {

          prod *= -vars[p.replace('-', '')];
        }
        else {
          if (Number.isInteger(Number.parseInt(p))) {
            prod *= p;
          }
          else if (vars.hasOwnProperty(p)) {
            prod *= vars[p];
          }
          else if (p == 'inf') {
            if (Math.sign(prod) == 1) {
              sum = 'inf';
              if (this.props.option.util != sum) {
                this.props.onUtilChange({...this.props.option, util: sum});
              }
              return;
            }
            else {
              sum = '-inf';
              if (this.props.option.util != sum) {
                this.props.onUtilChange({...this.props.option, util: sum});
              }
              return;
            }
          }
        }
      }

      sum += prod;
    }

    if (this.props.option.util != sum && Number.isInteger(sum)) {
      this.props.onUtilChange({...this.props.option, util: sum});
    }
  }  

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleChooseSentiment(sentiment) {
    this.props.onChooseSentiment(sentiment);
    this.setState({ showModal: false });
  }

  handleToggleCalc(event) {
    event.stopPropagation();
    this.setState({ showFunc: !this.state.showFunc });
  }

  handleChooseOptional(event, effect) {
    event.stopPropagation();
    this.props.onMakeAssumption(effect);
  }

  render() {
    return (
      <div>
        <div className={this.props.maxUtil <= this.props.option.util ? "option has-max-util" : "option"} onClick={this.handleOpenModal}>
          <span className={this.props.maxUtil <= this.props.option.util ? "glyphicon glyphicon-ok" : ""}></span>  <label>{this.props.option.description}</label>
          {this.props.option.effects.map((effect, index) => 
            <p className="effect">{effect.optional ? <input type="checkbox" onClick={(event) => this.handleChooseOptional(event, effect)} /> : <span className="glyphicon glyphicon-asterisk"></span>} {this.props.values.filter(v => v.code == effect.code)[0].name} = {effect.count}</p>
          )}
          <span className="toggle-calc" onClick={this.handleToggleCalc.bind(this)}>{this.state.showFunc ? "Hide calculation" : "Show calculation"}</span>
          <div className={ this.state.showFunc ? "shown" : "hidden" }>
            <h4>{this.props.utilFunc} = {this.props.option.util}</h4>
          </div>
        </div>

        <ReactModal 
          style={this.customStyles}
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example">
          <div>
            <h3>Common sentiments (Choose one)</h3>
              {this.props.option.sentiments.map((sentiment, index) =>
                <li className="sentiment list-group-item list-item-clickable" onClick={this.handleChooseSentiment.bind(this, sentiment)}>{sentiment.description}</li>
              )}
          </div>
          <br />
          <br />
          <button onClick={this.handleCloseModal}>Close</button>
        </ReactModal>
      </div>
    );
  }

}

export default Option;