import React from "react";
import { FormFeedback } from "reactstrap";

export const Validators = {
  required: (customMessage) => (value) => {
    if (!value)
      return {
        isValid: false,
        error: customMessage || "Please fill out this field",
      };

    return {
      isValid: true,
      error: "",
    };
  },
};

class ControlWithValidations extends React.Component {
  state = {
    touched: false,
    isValid: undefined,
    isInvalid: undefined,
    value: this.props.componentProps.value || "",
    error: "",
  };

  componentDidUpdate() {
    if (
      this.props.componentProps.value !== undefined &&
      this.state.value !== this.props.componentProps.value
    ) {
      this.setValue(this.props.componentProps.value);
    }
  }

  markAsTouched = () => {
    return new Promise((rs) => {
      this.setState(
        {
          touched: true,
        },
        rs
      );
    });
  };

  validateAsPromise = () => {
    return new Promise((rs, rj) => {
      try {
        this.validate((result) => {
          rs(result);
        });
      } catch (error) {
        rj(error);
      }
    });
  };

  validate = (cb) => {
    const { value } = this.state;
    const { validators } = this.props.options;
    if (!validators || !validators.length)
      return this.setState(
        {
          isValid: true,
          isInvalid: false,
          error: "",
        },
        () => {
          if (cb)
            cb({
              isValid: this.state.isValid,
              value: this.state.value,
            });
        }
      );

    const validationResult = validators.reduce(
      (prev, curr) => {
        if (!prev.isValid) return prev;
        const validation = curr(value);
        if (!validation.isValid) return validation;
        return {
          isValid: true,
          error: "",
        };
      },
      {
        isValid: true,
        error: "",
      }
    );

    this.setState(
      {
        isValid: validationResult.isValid,
        isInvalid: this.state.touched && !validationResult.isValid,
        error: validationResult.error,
      },
      () => {
        if (cb)
          cb({
            isValid: this.state.isValid,
            value: this.state.value,
          });
      }
    );
  };

  setValue = (value, cb) => {
    this.setState(
      {
        value,
      },
      () => {
        this.validate(cb);
      }
    );
  };

  render() {
    const {
      children: Component,
      componentProps: { onChange, onFocus, onBlur },
    } = this.props;
    return (
      <React.Fragment>
        <Component
          {...{
            ...this.props.componentProps,
            value: this.state.value,
          }}
          onFocus={(e) => {
            this.setState({
              touched: true,
            });
            if (onFocus) onFocus(e);
          }}
          onChange={(e) => {
            const value = e.target.value;
            this.setValue(value, () => {
              if (onChange) onChange(value, this.state.isValid);
            });
          }}
          onBlur={(e) => {
            this.validate(() => {
              if (onBlur) onBlur(e);
              if (onChange) onChange(this.state.value, this.state.isValid);
            });
          }}
          valid={this.state.isValid}
          invalid={this.state.isInvalid}
        />
        <FormFeedback valid={this.state.isValid}>
          {this.state.error}
        </FormFeedback>
      </React.Fragment>
    );
  }
}

export const withValidations = (Component, options = {}) => {
  return React.forwardRef((props, ref) => (
    <ControlWithValidations
      ref={ref}
      componentProps={props || {}}
      options={options}
      children={Component}
    />
  ));
};
