/** @jsx h */
import { h, Component } from 'preact';
import cls from 'classnames';

import s from './Tooltip.css';

export default class Tooltip extends Component {

  static marginX = 10;
  static marginY = 30;

  constructor(props) {
    super(props);

    this.mouseCoords = {
      x: 0,
      y: 0
    };

    this.state = {
      left: 0,
      top: 0
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  render() {
    const { children, visible } = this.props;
    const className = cls({
      [s.container]: true,
      [s.hidden]: !visible
    });

    return (
      <div ref={this.saveNode}
        className={className}
        style={this.getStyle()}>
        {children}
      </div>
    );
  }

  saveNode = node => (this.node = node);

  getStyle() {
    return {
      left: this.state.left,
      top: this.state.top
    };
  }

  updatePosition() {
    if (!this.props.visible) return;

    const pos = {
      left: this.mouseCoords.x + Tooltip.marginX,
      top: this.mouseCoords.y + Tooltip.marginY
    };

    const boundingRect = this.node.getBoundingClientRect();

    if (pos.left + boundingRect.width > window.innerWidth) {
      // Shifting horizontally
      pos.left = window.innerWidth - boundingRect.width;
    }

    if (pos.top + boundingRect.height > window.innerHeight) {
      // Flipping vertically
      pos.top = this.mouseCoords.y - Tooltip.marginY - boundingRect.height;
    }

    this.setState(pos);
  }

  onMouseMove = event => {
    Object.assign(this.mouseCoords, {
      x: event.pageX,
      y: event.pageY
    });

    if (this.props.visible) {
      this.updatePosition();
    }
  };

}
