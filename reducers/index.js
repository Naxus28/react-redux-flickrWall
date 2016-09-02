/*-------------------
   Imports
--------------------*/
import { combineReducers } from 'redux';
import {
	PROCESSING_PHOTOS,
	SEARCH_PHOTOS,
	RECEIVE_PHOTOS,
	API_CALL_FAIL
} from '../actions/index'

/*-------------------
   Reducers
--------------------*/
//manage the state of the keyword--returns a string
const keywordInput = (state='', action) => {
	switch(action.type){
		case SEARCH_PHOTOS:
			return action.keyword;
		default:
			return state;
	}
}

//'receveidPhotos' manages the state of the flickr photo object--returns an object
//just before the API is called, we set 'isFetching' to true--UI will inform the user the photos are loading
//if there is an error in the API call, we set 'apiError' to true and pass the error message to 'errorMessage'
//the UI will display the error message
//if the call is successful, the images retrived will be set inside the photos array
const receveidPhotos = (state={
	isFetching: false,
	apiError: false,
	errorMessage: '',
	photos: []
}, action) => {
	switch(action.type){
		case PROCESSING_PHOTOS:
      // merge 'isFetching' into the the current state obj
			return Object.assign({}, state, 
				{
					isFetching: true
				});
		case RECEIVE_PHOTOS:
      // merge all keys below into the the current state obj
			return Object.assign({}, state, 
			{
				isFetching: false,
				apiError: false,
				errorMessage: '',
				photos: action.photos
			});
		case API_CALL_FAIL:
      // merge all keys below into the the current state obj
			return Object.assign({}, state, 
				{
					isFetching: false,
					apiError: true,
					errorMessage: action.message,
					photos: []
				});
		default:
			return state;
	}
}

/*-------------------
   Combine Reducers
--------------------*/
const rootReducer = combineReducers({
	keywordInput,
	receveidPhotos
});

export default rootReducer;



