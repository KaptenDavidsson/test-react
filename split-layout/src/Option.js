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
    var vars = {};
    for (var effect of this.props.option.effects) {
      if (!effect.optional || this.props.myAssumptions.map(a => a.effect).some(a => a.id === effect.id)) {
        if (effect.code in vars) {
          vars[effect.code] += effect.count;
        }
        else {
          vars[effect.code] = effect.count;
        }
      }
    }

    var formattedUtilFunc = this.props.utilFunc.replace(/-/g, '+-');

    var sum = 0;
    for (var s of formattedUtilFunc.split('+')) {
      var prod = 1;
      if (s === '') continue;

      for (var p of s.split('*')) {
          if (p === '') {
            prod = 0;
            continue;
          }
        if (!vars.hasOwnProperty(p.replace('-', '')) && !Number.isInteger(Number.parseInt(p)) && p !== 'inf') {
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
          else if (p === 'inf') {
            if (Math.sign(prod) === 1) {
              sum = 'inf';
              if (this.props.option.util !== sum) {
                this.props.onUtilChange({...this.props.option, util: sum});
              }
              return;
            }
            else {
              sum = '-inf';
              if (this.props.option.util !== sum) {
                this.props.onUtilChange({...this.props.option, util: sum});
              }
              return;
            }
          }
        }
      }

      sum += prod;
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
      <div>
        <div className={this.props.allUtilSame ? "option neutral-choice" : (this.props.option.util === this.props.maxUtil ? "option has-max-util" : "option neutral-choice")}>
        {/*<div className="option neutral-choice">*/}
          <span className="option-title">{this.props.option.description}</span> {this.props.myPreferred.some(p => p.preferredOption.description === this.props.option.description && p.dilemmaId === this.props.dilemmaId) ? '(Preferred)' : ''}
          
          {!this.props.allUtilSame && this.props.option.util === this.props.maxUtil ? 
            <div className="prefer">According to your function this is the moral choice</div> 
            : 
            <div className="prefer" onClick={this.handleOpenModal}>According to your function this is not the moral choice. Click here for help in modifying your function towards this choice</div>}

          {this.props.option.effects.map((effect, index) => 
            <p key={index} className="effect">
            {effect.optional ? 
              <Checkbox 
                checked={this.props.myAssumptions.map(a => a.effect).some(a => a.id === effect.id)} 
                onCheck={(event) => this.handleChooseOptional(event, effect)} /> 
              : 
              <span className="glyphicon glyphicon-asterisk"></span>
            }
            <div> 
              {this.props.values.filter(v => v.code === effect.code)[0].name} = {effect.count} {effect.explanation ? '(' + effect.explanation + ')' : ''} {effect.inDepth ? <span className="glyphicon glyphicon-info-sign" onClick={(e) => this.handleShowEffectInfo(e, effect)}></span> : ""}
            </div>
            </p>
          )}
          <br />
          <span className="glyphicon glyphicon-triangle-right"></span><span className="show-calc-button" onClick={this.handleToggleCalc.bind(this)}>{this.state.showFunc ? "Hide calculation" : "Show calculation"}</span>
          <br/>
          <div className={ this.state.showFunc ? "shown" : "hidden" }>
            <h4>f(x): {this.props.utilFunc} = {this.props.option.util}</h4>
          </div>
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
                <div>{sentiment.description}</div>
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
          <button onClick={this.handleCloseModal}>Close</button>
        </ReactModal>

        <ReactModal 
          style={this.customStyles}
          isOpen={this.state.showEffectInfo}
          contentLabel="Minimal">
          <div>
            <h3>Effect</h3>
            {this.state.modalEffect.inDepth}
          </div>
          <br />
          <br />
          <button onClick={this.handleCloseEffectInfo.bind(this)}>Close</button>
        </ReactModal>

        <ReactModal 
          style={this.customStyles}
          isOpen={this.state.showAddEffectModal}
          contentLabel="Minimal">
          <div>
            Add not suppored yet. Mail your suggestion to kaptendavidsson@yahoo.se. 
          </div>
          <br />
          <button onClick={this.handleCloseAddEffect.bind(this)}>Close</button>
        </ReactModal>
      </div>
      </MuiThemeProvider>
    );
  }

}

export default Option;