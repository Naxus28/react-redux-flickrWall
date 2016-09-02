/*-------------------
   Imports
--------------------*/
import React, { PropTypes, Component } from 'react'

/*-------------------------------------
   SearchBar presentational component
--------------------------------------*/
//gets user input and passes it to 'handleSearchApi'
//inside 'App' component; 
//'handleSearchApi' will dispatch 'searchPhotos(keyword)'
export default class SearchBar extends Component {
  render() {
    let input;
    const { onClick } = this.props
    return (
      <div className="form" ref="form">
        <input  
          type="text" 
          placeholder="Keyword"
          ref={node => {
        input=node;
      }} />
        <button
          onClick={()=>{
            onClick(input.value)
          }}
        >
          Search Images on Flickr
        </button>
      </div>
    )
  }
}

SearchBar.propTypes = {
  onClick: PropTypes.func
}