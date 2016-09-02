/*-------------------
   Imports
--------------------*/
import React, { Component, PropTypes } from 'react'

/*-------------------------------------
   PhotoList presentational component
--------------------------------------*/
//gets props from 'PhotoList' component
//renders images individually
export default class Photo extends Component {
  render() {
    const { key, href, src, alt, className, imgClassName } = this.props
    return (
      <div className={className} key={key}>
          <a href={href} target='_blank'>
            <img 
              src={src} 
              alt={alt} 
              className={imgClassName}/>
          </a>
      </div>
    )
  }
}