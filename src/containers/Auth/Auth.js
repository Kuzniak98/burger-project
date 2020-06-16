import React, { Component } from 'react';
import Input from '../../components/UL/Input/Input';
import Button from '../../components/UL/Button/Button';
import { connect } from 'react-redux';
import Spinner from '../../components/UL/Spinner/Spinner';
import * as actions from '../../store/actions';
import { Redirect } from 'react-router-dom';
import './Auth.css';
import { updatedObject } from '../../shared/utility';
class Auth extends Component {
  state = {
    isSignUp: true,
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email adress'
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false,
          isEmail: true
        }
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          valid: false,
          touched: false,
          minLength: 6
        }
      }
    },
    isFormValid: false
  }
  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }
    return isValid;
  }
  inputOnChangeHandler = (e, key) => {
    const updatedControl = updatedObject(this.state.controls[key], {
      value: e.target.value,
      validation: updatedObject(this.state.controls[key].validation, {
        touched: true,
        valid: this.checkValidity(e.target.value, this.state.controls[key].validation)
      })
    })
    const updatedControls = updatedObject(this.state.controls, {
      [key]: updatedControl
    })
    let isFormValid = true;
    for (let inputName in updatedControls) {
      if (!updatedControls[inputName].validation.valid) {
        isFormValid = false;
      }
    }
    this.setState({
      controls: updatedControls,
      isFormValid
    })
  }
  submitHandler = (e) => {
    e.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  }
  switchAuthModeHandler = (e) => {
    e.preventDefault();
    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp
      }
    })
  }
  componentDidMount() {
    if (!this.props.isBurgerBuilding && this.props.redirectPath !== '/') {
      this.props.onSetAuthRedirectPath('/')
    }
  }
  render() {
    let inputElements = [];

    for (let inputName in this.state.controls) {
      let obj = {}
      for (let attr in this.state.controls[inputName]) {
        obj[attr] = this.state.controls[inputName][attr];
      }
      obj['id'] = inputName;
      inputElements.push(obj);
    }
    let form = (<form onSubmit={this.orderHandler}>
      {inputElements.map(inputElement => <Input name={inputElement.id} touched={inputElement.validation.touched} isValid={inputElement.validation.valid} onChange={(e) => this.inputOnChangeHandler(e, inputElement.id)} key={inputElement.id} elementConfig={inputElement.elementConfig} elementType={inputElement.elementType} value={inputElement.value} />)}
      <Button click={this.submitHandler} disabled={!this.state.isFormValid} btnType='Success'>SUBMIT</Button>
    </form>)
    if (this.props.loading) {
      form = <Spinner />
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }
    let redirect = null;
    if (this.props.isAuth) {
      redirect = <Redirect to={this.props.redirectPath} />
    }
    return (
      <div className='Auth'>
        {redirect}
        {errorMessage}
        {form}
        <Button click={this.switchAuthModeHandler} btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: (url) => dispatch(actions.setAuthRedirectPath(url))
  }
}
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    isBurgerBuilding: state.burgerBuilder.building,
    redirectPath: state.auth.redirectPath
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);