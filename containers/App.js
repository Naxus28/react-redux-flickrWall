/*-------------------
   Imports
--------------------*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { searchPhotos, receivePhotos, fetchPhotos } from '../actions/index'
import PhotoList from '../components/PhotoList'
import SearchBar from '../components/SearchBar'

/*-----------------------
   App Container Component
------------------------*/
class App extends Component {
  constructor(props) {
    super(props)
    this.handleSearchApi = this.handleSearchApi.bind(this)
  }

  //dispatch action on page load
  //because there is no keyword at this point, app fetches 'getRecent' API
  componentDidMount(){
    const { dispatch, keyword } = this.props
    dispatch(fetchPhotos(keyword));
  }

  //dispatch action if this.props !== nexProps
  //meaning, if the new keyword is different than the previous keyword
  componentWillReceiveProps(nextProps) { 
    if (nextProps.keyword !== this.props.keyword) {
      const { dispatch, keyword } = nextProps
      dispatch(fetchPhotos(keyword))
    }
  }

  //dispatch action when user performs a search
  //changes the state of the 'keywordInput' reducer (meaning it changes the keyword)
  handleSearchApi(keyword){
    const { dispatch } = this.props
    dispatch(searchPhotos(keyword));
  }

  //react render method
  render(){
    const { photosObj, keyword } = this.props

    return(
      <div>

      {/*if app is about to start fetching API*/}
      { photosObj.isFetching &&
        <div className="loadingWrapper">
          <h2 className="loading">Loading Photos...</h2>
          <p className="spinner"><i className="fa fa-4x fa-spinner fa-spin" /></p>
        </div>
      }

      {/*if API was fetched and returned an error*/}
      { photosObj.apiError &&
        <div className="errorMessageWrapper">
          <p className="apiError">{photosObj.errorMessage}</p>
        </div>
      }

      {/*if API was fetched but there are no results*/}
      { !photosObj.isFetching &&
        photosObj.photos.length === 0 &&
        !photosObj.apiError &&
        <div className="loadingWrapper">
          <h2 className="loading">No results for {keyword}</h2>
        </div>
      }

      {/*if API was fetched and there are results*/}
      { !photosObj.isFetching &&
        photosObj.photos.length > 0 &&
        !photosObj.apiError &&
        <div>
          <PhotoList photosObj={photosObj} keyword={keyword} />
          <SearchBar onClick={this.handleSearchApi} />
        </div>
      }

      {/*if API was fetched and there are no errors--there may or may not be results*/}
      {!photosObj.isFetching && 
        !photosObj.apiError &&
        <div>
          <SearchBar onClick={this.handleSearchApi} />
        </div>
      }
      </div>
    );
  }
}


/*-----------------------
   Map State to Props
------------------------*/
//returns the state of the app and 
//passes it as props to the 'App' component 
//via the 'connect' function below
const mapStateToProps = (state) => {
  console.log('state: ', state);
  const photosObj = state.receveidPhotos;
  const keyword = state.keywordInput;

  return {
    photosObj,
    keyword
  }
}

export default connect(mapStateToProps)(App)