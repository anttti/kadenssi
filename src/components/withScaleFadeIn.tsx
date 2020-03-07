import React from "react";
import { Transition } from "react-spring/renderprops";

interface IWithScaleFadeIn {
  isVisible: boolean;
}

const withScaleFadeIn = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return class extends React.Component<P & IWithScaleFadeIn> {
    render() {
      return (
        <Transition
          items={this.props.isVisible}
          from={{
            position: "absolute",
            opacity: 0,
            transform: "scale(0.95)"
          }}
          enter={{ opacity: 1, transform: "scale(1)" }}
          leave={{ opacity: 0, transform: "scale(0.95)" }}
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

export default withScaleFadeIn;
