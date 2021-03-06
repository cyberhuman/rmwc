// @flow
import type { SimpleTagPropsT } from '@rmwc/base';
import type { IconPropsT } from '@rmwc/icon';
import * as React from 'react';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield';

import {
  simpleTag,
  withFoundation,
  syncFoundationProp,
  randomId
} from '@rmwc/base';

import { Icon } from '@rmwc/icon';
import { LineRipple } from '@rmwc/line-ripple';
import { FloatingLabel } from '@rmwc/floating-label';
import { NotchedOutline, NotchedOutlineIdle } from '@rmwc/notched-outline';

/*********************************************************************
 * TextField
 *********************************************************************/
export type TextFieldPropsT = {
  /** Makes a multiline TextField. */
  textarea?: boolean,
  /** Sets the value for controlled TextFields. */
  value?: string | number,
  /** Makes the TextField fullwidth. */
  fullwidth?: boolean,
  /** Makes the TextField have a visual box. */
  box?: boolean,
  /** A ref for the native input. */
  inputRef?: React.Ref<any>,
  /** Disables the input. */
  disabled?: boolean,
  /** Mark the input as required. */
  required?: boolean,
  /** Makes the TextField visually invalid. This is sometimes automatically applied in cases where required or pattern is used.  */
  invalid?: boolean,
  /** Makes the TextField dense */
  dense?: boolean,
  /** Outline the TextField */
  outlined?: boolean,
  /** A label for the input. */
  label?: React.Node,
  /** Add a leading icon. */
  withLeadingIcon?: React.Node,
  /** Add a trailing icon. */
  withTrailingIcon?: React.Node,
  /** By default, props spread to the input. These props are for the component's root container. */
  rootProps?: Object,
  /** The type of input field to render */
  type?: string
} & SimpleTagPropsT &
  //$FlowFixMe
  React.InputHTMLAttributes<HTMLInputElement>;

export const TextFieldRoot = simpleTag({
  displayName: 'TextFieldRoot',
  classNames: (props: TextFieldPropsT) => [
    'mdc-text-field',
    'mdc-text-field--upgraded',
    {
      'mdc-text-field--textarea': props.textarea,
      'mdc-text-field--fullwidth': props.fullwidth,
      'mdc-text-field--box': props.box,
      'mdc-text-field--outlined': props.outlined,
      'mdc-text-field--dense': props.dense,
      'mdc-text-field--invalid': props.invalid,
      'mdc-text-field--disabled': props.disabled,
      'mdc-text-field--with-leading-icon': props.withLeadingIcon,
      'mdc-text-field--with-trailing-icon': props.withTrailingIcon
    }
  ],
  consumeProps: [
    'textarea',
    'box',
    'fullwidth',
    'outlined',
    'dense',
    'invalid',
    'disabled',
    'withLeadingIcon',
    'withTrailingIcon'
  ]
});

export const TextFieldInput = simpleTag({
  displayName: 'TextFieldInput',
  tag: 'input',
  classNames: 'mdc-text-field__input',
  defaultProps: {
    type: 'text'
  }
});

export const TextFieldTextarea = simpleTag({
  displayName: 'TextFieldTextarea',
  tag: 'textarea',
  classNames: 'mdc-text-field__input'
});

/** A TextField component for accepting text input from a user. */
export class TextField extends withFoundation({
  constructor: MDCTextField,
  adapter: {}
})<TextFieldPropsT> {
  static displayName = 'TextField';

  valid: boolean;
  value: any;
  disabled: boolean;
  foundation_: any;

  syncWithProps(nextProps: TextFieldPropsT) {
    // invalid | valid
    this.foundation_.setUseNativeValidation(nextProps.invalid === undefined);

    syncFoundationProp(
      nextProps.invalid,
      !this.valid,
      () => (this.valid = !nextProps.invalid)
    );

    // value
    syncFoundationProp(nextProps.value, !this.value, () => {
      this.value = nextProps.value;
    });

    // disabled
    syncFoundationProp(
      nextProps.disabled,
      this.disabled,
      () => (this.disabled = !!nextProps.disabled)
    );
  }

  render() {
    const {
      label = '',
      className,
      style,
      inputRef,
      box,
      outlined,
      fullwidth,
      dense,
      invalid,
      disabled,
      withLeadingIcon,
      withTrailingIcon,
      children,
      textarea,
      rootProps = {},
      apiRef,
      ...rest
    } = this.props;

    const { root_ } = this.foundationRefs;

    const tagProps = {
      ...rest,
      disabled: disabled,
      elementRef: inputRef,
      id: rest['id'] || randomId('text-field'),
      // fixes an issue with the deprecated non box input
      style:
        box === undefined && outlined === undefined ? { marginTop: '3px' } : {}
    };

    const tag = textarea ? (
      <TextFieldTextarea {...tagProps} />
    ) : (
      <TextFieldInput {...tagProps} />
    );

    // handle leading and trailing icons
    const renderIcon = (iconNode: any) => {
      if (
        (iconNode && typeof iconNode === 'string') ||
        (iconNode.type &&
          iconNode.type.displayName !== TextFieldIcon.displayName)
      ) {
        return <TextFieldIcon icon={iconNode} />;
      }

      return iconNode;
    };

    return (
      <TextFieldRoot
        {...rootProps}
        invalid={invalid}
        withLeadingIcon={!!withLeadingIcon}
        withTrailingIcon={!!withTrailingIcon}
        textarea={textarea}
        box={box}
        dense={dense}
        disabled={disabled}
        outlined={outlined}
        fullwidth={fullwidth}
        elementRef={root_}
        className={className}
        style={style}
      >
        {!!withLeadingIcon && renderIcon(withLeadingIcon)}
        {children}
        {tag}
        {!!label && (
          <FloatingLabel htmlFor={tagProps.id}>{label}</FloatingLabel>
        )}
        {!!withTrailingIcon && renderIcon(withTrailingIcon)}

        {!!outlined && <NotchedOutline />}
        {!!outlined ? <NotchedOutlineIdle /> : <LineRipple />}
      </TextFieldRoot>
    );
  }
}

/*********************************************************************
 * Helper Text
 *********************************************************************/
export type TextFieldHelperTextPropsT = {
  /** Make the help text always visible */
  persistent?: boolean,
  /** Make the help a validation message style */
  validationMsg?: boolean
};

const TextFieldHelperTextRoot = simpleTag({
  displayName: 'TextFieldHelperTextRoot',
  tag: 'p',
  classNames: (props: TextFieldHelperTextPropsT) => [
    'mdc-text-field-helper-text',
    {
      'mdc-text-field-helper-text--persistent': props.persistent,
      'mdc-text-field-helper-text--validation-msg': props.validationMsg
    }
  ],
  consumeProps: ['persistent', 'validationMsg']
});

/**
 * A help text component
 */
export const TextFieldHelperText: React.ComponentType<
  TextFieldHelperTextPropsT
> = (props: TextFieldHelperTextPropsT) => (
  <TextFieldHelperTextRoot {...props} />
);

TextFieldHelperText.displayName = 'TextFieldHelperText';

/*********************************************************************
 * Icon
 *********************************************************************/

/**
 * An Icon in a TextField
 */
export const TextFieldIcon: React.ComponentType<IconPropsT> = simpleTag({
  tag: Icon,
  displayName: 'TextFieldIcon',
  classNames: 'mdc-text-field__icon'
});

export default TextField;
