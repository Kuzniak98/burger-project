import React, { Component } from 'react'
import Button from '../../../components/UL/Button/Button';
import './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UL/Spinner/Spinner';
import Input from '../../../components/UL/Input/Input';
class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name'
        },
        value: ''
      },

      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: ''
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: ''
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email'
        },
        value: ''
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [{ value: 'fastest', displayValue: 'Fastest' }, { value: 'cheapest', displayValue: 'Cheapest' }]
        },
        value: ''
      }
    }
  }

  orderHandler = (event) => {
    event.preventDefault();
    let formData = {};

    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    this.setState({
      loading: true
    })
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    }

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({
          loading: false,
        })
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          loading: false,
        })
      })
  }
  inputOnChangeHandler = (e, key) => {
    let updatedOrderForm = { ...this.state.orderForm };
    updatedOrderForm[key].value = e.target.value
    this.setState({
      orderForm: updatedOrderForm
    })
  }
  render() {
    let inputElements = [];

    for (let inputName in this.state.orderForm) {
      let obj = {}
      for (let attr in this.state.orderForm[inputName]) {
        obj[attr] = this.state.orderForm[inputName][attr];
      }
      obj['id'] = inputName;
      inputElements.push(obj);
    }

    let form = (<form onSubmit={this.orderHandler}>
      {inputElements.map(inputElement => <Input onChange={(e) => this.inputOnChangeHandler(e, inputElement.id)} key={inputElement.id} elementConfig={inputElement.elementConfig} elementType={inputElement.elementType} value={inputElement.value} />)}
      <Button click={this.orderHandler} btnType='Success'>ORDER</Button>
    </form>)

    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className='ContactData'>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;