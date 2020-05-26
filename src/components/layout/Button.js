import React, { Component } from 'react';

class Button extends Component {
  static defaultProps = {
    height: 'btn-lg',
  };
  render() {
    return (
      <button className={`btn btn-dark ${this.props.height}`}>Click Me!</button>
    );
  }
}

export default Button;
