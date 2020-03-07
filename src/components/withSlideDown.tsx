import React from "react";
import { Transition } from "react-spring/renderprops";

interface IWithSlideDown {
  isVisible: boolean;
}

const withSlideDown = <P extends object>(Component: React.ComponentType<P>) => {
  return class extends React.Component<P & IWithSlideDown> {
    render() {
      return (
        <Transition
          items={this.props.isVisible}
          from={{
            position: "absolute",
            transform: "translateY(-100%)"
          }}
          enter={{ transform: "translateY(0)" }}
          leave={{ transform: "translateY(-100%)" }}
        >
          {isSetup =>
            isSetup
              ? props => <Component style={props} {...this.props} />
              : null
          }
        </Transition>
      );
    }
  };
};

export default withSlideDown;
