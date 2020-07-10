import React, { useState, useEffect } from 'react';
import BurgerSvg from '../../components/BurgerSvg/BurgerSvg';
import gsap from 'gsap';
import BurgerBuilder from './BurgerBuilder';
import './burgerBuilderAnimation.scss';

const BurgerAnimation = () => {

  const [fillPercent, setFillPercent] = useState(0);
  const [inter, setInter] = useState(null);
  const [success, setSuccess] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const fillBar = () => {
    clearInterval(inter);
    gsap.set('.progress-bar', { visibility: 'visible' })
    setInter(setInterval(() => {
      setFillPercent(prevPercent => prevPercent + 0.66666)
    }, 10))
  }
  useEffect(() => {
    if (fillPercent >= 100) {
      clearInterval(inter)
    }
    if (fillPercent < 0) {
      setFillPercent(0)
      clearInterval(inter)
      setInter(null)
    }
  }, [fillPercent, setInter, inter])
  const checkFillBarState = () => {
    clearInterval(inter)
    if (fillPercent < 100) {
      setInter(setInterval(() => {
        setFillPercent(prevPercent => prevPercent - 1.5)
      }, 10))
    }
    else {
      setSuccess(true);
    }
  }
  const message = () => {
    if (fillPercent >= 100) {
      return 'Explode!'
    } else if (fillPercent < 2) {
      return 'Build!'
    }
    else {
      return 'Hold!'
    }
  }
  useEffect(() => {
    if (success) {
      gsap.to('.progress-bar', { autoAlpha: 0, duration: .2 })
      gsap.to('.heading-build', { autoAlpha: 0, duration: .2 })
      gsap.set('.burger-builder-animation .burger', { cursor: 'default' })
      gsap.set('.burger-builder-animation .burger .item', { cursor: 'pointer' })
    }
  }, [success])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'Power2.out' } })
    tl.fromTo('.burger-builder-animation .burger .item', { x: '-500', autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .1, duration: '.5' })
    tl.fromTo('.heading-build', { scale: 15, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .3 })
  }, [])
  let content = (
    <>
      <h1 className='heading-build'>
        {message()}
      </h1>
      <div onMouseUp={checkFillBarState} onMouseDown={fillBar} onMouseLeave={checkFillBarState} className="trigger">
        <BurgerSvg complete={setAnimationComplete} success={success} fill={fillPercent} />
      </div>
      <div className="progress-bar">
        <div style={{ width: `${fillPercent}%` }} className="fill"></div>
      </div>
    </>
  )
  if (animationComplete) {
    content = <BurgerBuilder />
  }
  return (
    <div className="burger-builder-animation">
      {content}
    </div>
  );
}

export default BurgerAnimation;