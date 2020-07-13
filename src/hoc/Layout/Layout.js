import React, { useState } from 'react';
import './Layout.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Layout = (props) => {
  const [sideDrawerShown, setSideDrawerShown] = useState(false);

  const sideDrawerHandler = () => {
    setSideDrawerShown((prevState) => !prevState)
  }
  return (
    <>
      <Toolbar isAuth={props.isAuth} sideDrawerHandle={sideDrawerHandler} />
      <SideDrawer isAuth={props.isAuth} show={sideDrawerShown} sideDrawerHandle={sideDrawerHandler} />
      <main>
        {props.children}
      </main>
      <footer style={props.location.pathname === '/checkout' || props.location.pathname === '/checkout/contact-data' ? { position: 'fixed', bottom: 0, left: 0, width: '100vw', zIndex: '9999999' } : {}} className='footer'>
        <p className='footer__text'>© Made by <span><a href='https://github.com/Kuzniak98' target="_blank" rel="noopener noreferrer">WieJak</a></span>. 2020</p>
      </footer>
    </>
  )
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}

export default withRouter(connect(mapStateToProps)(Layout));
