import React from "react";
import { Transition } from "react-spring/renderprops";

interface IWithFadeIn {
  isVisible: boolean;
}

const withFadeIn = <P extends object>(Component: React.ComponentType<P>) => {
  return class extends React.Component<P & IWithFadeIn> {
    render() {
      return (
        <Transition
          items={this.props.isVisible}
          from={{
            position: "absolute",
            opacity: 0
          }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
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

export default withFadeIn;
