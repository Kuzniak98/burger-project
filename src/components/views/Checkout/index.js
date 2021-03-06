import React, { useEffect } from 'react'
import gsap from 'gsap';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import CheckoutSummary from './CheckoutSummary';
import ContactData from './ContactData';
import * as actions from '../../../store/actions';

const Checkout = ({ history, leaving, path, onRedirectEnd, onRedirectStart, ings, purchased, match }) => {

  const checkoutCancelledHandler = () => {
    onRedirectStart('/burger-builder');
  }
  const checkoutContinueHandler = () => {
    history.replace('/checkout/contact-data')
    setTimeout(() => {
      document.querySelector('.contact-data').scrollIntoView({
        behavior: 'smooth'
      })
    }, 100)
  }
  let summary = <Redirect to='/' />
  if (ings) {
    const purchasedRedirect = purchased ? <Redirect to='/' /> : null
    summary = (
      <div className='checkout'>
        {purchasedRedirect}
        <CheckoutSummary checkoutCancelled={checkoutCancelledHandler} checkoutContinue={checkoutContinueHandler} />
        <Route path={match.url + '/contact-data'} component={ContactData} />
      </div>
    )
  }
  useEffect(() => {
    if (leaving) {
      gsap.to('.checkout', {
        scale: 0.95, autoAlpha: 0, duration: 1, ease: 'power2.out', onComplete: () => {
          console.log(path)
          onRedirectEnd()
          history.replace(path)
        }
      })
    }
  }, [leaving, path, onRedirectEnd, history])
  return summary;
}

const mapDispatchToProps = dispatch => {
  return {
    onRedirectStart: (path) => dispatch(actions.redirectStart(path)),
    onRedirectEnd: () => dispatch(actions.redirectEnd())
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
    leaving: state.redirect.leaving,
    path: state.redirect.path
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Checkout);