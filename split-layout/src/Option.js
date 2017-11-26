import React, { Component } from 'react';


class Option extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <li className="list-group-item list-item-clickable">
        <span  className={this.props.maxUtil <= this.props.option.util ? "glyphicon glyphicon-ok" : ""}></span>  <label>{this.props.option.description}</label>
        {this.props.option.effects.map((effect, index) => 
          <p className="effect"><span className="glyphicon glyphicon-asterisk"></span> {this.props.values.filter(v => v.code == effect.code)[0].name} = {effect.count}</p>
        )}
        <div className="left-function">
          <h4>Utility: {this.props.utilFunc} = {this.props.option.util}</h4>
        </div>
      </li>
    );
  }

}

export default Option;