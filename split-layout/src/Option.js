import React, { Component } from 'react';
import './Option.css'; 
import ReactModal from 'react-modal';
import { Checkbox, RaisedButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class Option extends Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false, showFunc: false, showEffectInfo: false, modalEffect: {} };

    this.customStyles = {
      overlay : {
        position          : 'fixed',
        top               : '60px',
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(150, 150, 150, 0.50)'
      },
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChooseOptional = this.handleChooseOptional.bind(this);
    this.handleShowEffectInfo = this.handleShowEffectInfo.bind(this);
  }

  componentDidUpdate() {
  //   var vars = {};
  //   for (var effect of this.props.option.effects) {
  //     if (!effect.optional || this.props.myAssumptions.map(a => a.effect).some(a => a.id === effect.id)) {
  //       if (effect.code in vars) {
  //         vars[effect.code] += effect.count;
  //       }
  //       else {
  //         vars[effect.code] = effect.count;
  //       }
  //     }
  //   }

  //   var formattedUtilFunc = this.props.utilFunc.replace(/-/g, '+-');

  //   var sum = 0;
  //   for (var s of formattedUtilFunc.split('+')) {
  //     var prod = 1;
  //     if (s === '') continue;

  //     for (var p of s.split('*')) {
  //         if (p === '') {
  //           prod = 0;
  //           continue;
  //         }
  //       if (!vars.hasOwnProperty(p.replace('-', '')) && !Number.isInteger(Number.parseInt(p)) && p !== 'inf') {
  //         ;prod = 0;
  //       }

  //       if (p.includes('-') && !Number.isInteger(Number.parseInt(p)) && vars.hasOwnProperty(p.replace('-', ''))) {

  //         prod *= -vars[p.replace('-', '')];
  //       }
  //       else {
  //         if (Number.isInteger(Number.parseInt(p))) {
  //           prod *= p;
  //         }
  //         else if (vars.hasOwnProperty(p)) {
  //           prod *= vars[p];
  //         }
  //         else if (p === 'inf') {
  //           if (Math.sign(prod) === 1) {
  //             sum = 'inf';
  //             if (this.props.option.util !== sum) {
  //               this.props.onUtilChange({...this.props.option, util: sum});
  //             }
  //             return;
  //           }
  //           else {
  //             sum = '-inf';
  //             if (this.props.option.util !== sum) {
  //               this.props.onUtilChange({...this.props.option, util: sum});
  //             }
  //             return;
  //           }
  //         }
  //       }
  //     }

  //     sum += prod;
  //   }

    var valueCounts = {}
    for (var value of this.props.values) {
      if (this.props.option.effects.map(e => e.code).includes(value.code)) {
          valueCounts[value.code] = this.props.option.effects.filter(e => e.code == value.code)[0].count;
      }
      else {
        valueCounts[value.code] = 0;
      }

      if (this.props.myAssumptions.map(a => a.effect.code).includes(value.code)) {
        for (var assumption of this.props.myAssumptions.filter(a => a.effect.code == value.code && a.option.description == this.props.option.description)) {
          valueCounts[value.code] += assumption.effect.count;
        }
      }
    }


    var funcWithVars = Object.entries(valueCounts).map(e => 'var ' + e[0] + '=' + e[1]).join(';') + ';' + this.props.utilFunc;
    var sum = 0;

    try {
      sum = eval(funcWithVars);
    }
    catch(e) {

    } 

    if (this.props.option.util !== sum && Number.isInteger(sum)) {
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
    if (!this.props.mySentiments.some(s => s.description === sentiment.description)) {
      this.props.onChooseSentiment(sentiment);
      this.setState({ showModal: false });
    }
  }

  handleToggleCalc(event) {
    event.stopPropagation();
    this.setState({ showFunc: !this.state.showFunc });
  }

  handleChooseOptional(event, effect) {
    event.stopPropagation();
    this.props.onMakeAssumption(effect, this.props.option);
  }

  handleAssumptionClick(event) {
    event.stopPropagation();
  }

  handleShowEffectInfo(event, effect) {
    event.stopPropagation();

    this.setState({
      showEffectInfo: true,
      modalEffect: effect
    });
  }

  handleCloseEffectInfo() {
    this.setState({
      showEffectInfo: false
    });
  }

  handleAddEffect(event) {
    event.stopPropagation();

    this.setState({
      showAddEffectModal: true
    }); 
  }

  handleCloseAddEffect(event) {
    event.stopPropagation();
    
    this.setState({
      showAddEffectModal: false
    }); 
  }

  handleChoosePreferred(event) {
    this.props.handleChoosePreferred(this.props.option);
  }

  render() {
    return (
      <MuiThemeProvider>
      <div className={this.props.allUtilSame ? "option-flex-box option neutral-choice" : (this.props.option.util === this.props.maxUtil ? "option-flex-box option has-max-util" : "option-flex-box option neutral-choice")}>
      <div className="option-left-tile">
        <div >
        {/*<div className="option neutral-choice">*/}
          <div className="option-title">
            {this.props.option.description}
            <span className="marked-as-preferred">
              {this.props.myPreferred.some(p => p.preferredOption.description === this.props.option.description && p.dilemmaId === this.props.dilemmaId) ? '(Marked as Preferred)' : ''}
            </span>
          </div> 


          {this.props.option.effects.map((effect, index) => 
            <div key={index} className="effect">
            {effect.optional ? 
              <span className="effect-checkbox">
                <Checkbox 
                  checked={this.props.myAssumptions.map(a => a.effect).some(a => a.id === effect.id)} 
                  onCheck={(event) => this.handleChooseOptional(event, effect)} 
                  label={(this.props.values.filter(v => v.code === effect.code)[0].name + '=' + effect.count) + ' ' + (effect.explanation ? '(' + effect.explanation + ')' : '')}
                  />
              </span>
              : 
              <div>
              <span className="glyphicon glyphicon-asterisk"></span>
              <span className="effect-text">{this.props.values.filter(v => v.code === effect.code)[0].name} = {effect.count} {effect.explanation ? '(' + effect.explanation + ')' : ''}</span>
              </div>
            }
            <span className="effect-info"> 
               {effect.inDepth ? <span onClick={(e) => this.handleShowEffectInfo(e, effect)}>This is an assumption! (Read more)</span> : ""}
            </span>
            </div>
          )}
          <br />
          <span className={this.state.showFunc ? "glyphicon glyphicon-triangle-bottom" : "glyphicon glyphicon-triangle-right"}></span> <span className="show-calc-button" onClick={this.handleToggleCalc.bind(this)}>{this.state.showFunc ? "Hide calculation" : "Show calculation"}</span>
          <br/>
          <div className={ this.state.showFunc ? "shown" : "hidden" }>
            <h4>f(x): {this.props.utilFunc} = {this.props.option.util}</h4>
          </div>
        </div>
        </div>
        <div>
          {this.props.allUtilSame ?  
            <div className="prefer" onClick={this.handleOpenModal}>According to your function all choices are equally moral. Click here for help in modifying your function towards this choice</div> 
            :
            this.props.option.util === this.props.maxUtil ? 
            <div className="prefer">According to your function this is the moral choice</div> 
            : 
            <div className="prefer" onClick={this.handleOpenModal}>According to your function this is not the moral choice. Click here for help in modifying your function towards this choice</div>
          }
        </div>

        <ReactModal 
          style={this.customStyles}
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example">
          <div className="modify-function-help">
            <div className="modify-function-help-header">Modify function</div>

            Click some of the common sentiments below to add it to your function.

            <br />
            <br />
            <div>
            {this.props.option.sentiments.map((sentiment, index) =>
              <li className="sentiment-function-helper" key={index}> 
                <div className="sentiment-description">{sentiment.description}</div>
                <RaisedButton onClick={() => this.props.handleAddSentimentCode(sentiment)}>Add</RaisedButton>
                <span className="sentiment-function-helper-func">({sentiment.func})</span>
              </li>
            )}
            </div>
            <br />
            <div className="sentiment-modal-separator"></div>
            <br />
            ...or mark this choice as your preferred answer and let the application calculate an appropriate function for you.
            <br />
            <br />
            <Checkbox label="Mark this as my preferred answer" checked={this.props.myPreferred.some(p => p.preferredOption.description === this.props.option.description && p.dilemmaId === this.props.dilemmaId)} onCheck={(event) => this.handleChoosePreferred(event)} ></Checkbox>

            {/*
            <span><input type="checkbox" checked={this.props.myPreferred.some(p => p.preferredOption.description === this.props.option.description && p.dilemmaId === this.props.dilemmaId)} onChange={(event) => this.handleChoosePreferred(event)} /> Mark this as my preferred answer</span>
            */}
          </div>
          <br />
          <RaisedButton onClick={this.handleCloseModal}>Close</RaisedButton>
        </ReactModal>

        <ReactModal 
          style={this.customStyles}
          isOpen={this.state.showEffectInfo}
          contentLabel="Minimal">
          <div>
            <h3>Assumption</h3>
            <div className="assumption-info-text">
              In this context an assumption is every effect that is not explicitly or implicitly stated as part of the dilemma. 
            </div>
            <div>
              {this.state.modalEffect.inDepth}
            </div>
          </div>
          <br />
          <br />
          <RaisedButton onClick={this.handleCloseEffectInfo.bind(this)}>Close</RaisedButton>
        </ReactModal>
      </div>
      </MuiThemeProvider>
    );
  }

}

export default Option;