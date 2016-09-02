/*-------------------
   Imports
--------------------*/
import fetch from 'isomorphic-fetch'

/*-------------------
   Action Types
--------------------*/
export const PROCESSING_PHOTOS 	= 'PROCESSING_PHOTOS'
export const SEARCH_PHOTOS 		  = 'SEARCH_PHOTOS'
export const RECEIVE_PHOTOS     = 'RECEIVE_PHOTOS'
export const API_CALL_FAIL      = 'API_CALL_FAIL'

/*-------------------
   Action Creators
--------------------*/
//dispatched just before we start fetching photos from the API
//flags 'isFetching' to true
//informs the UI that the app should display a 'is loading' message and a spinner
const processingPhotos = () => {
	return {
		type: PROCESSING_PHOTOS
	}
}

//dispatched when there is a search
//sets the new state of the 'keywordInput' reducer
//'keywordInput' state (meaning the keyword) is passed as props into 'App' component
//react's 'componenteWillReceiveProps' compares the new props (new keyword) with the previous prop (previous keyword)
//if they are different, 'fetchPhotos(keyword)' is dispatched to pull new photos from Flickr
export const searchPhotos = (keyword) => {
	return {
		type: SEARCH_PHOTOS,
		keyword
	}
}

//dispatched within 'fetchPhotos', after the API was fetched
//receives the data from the API and sets the new object for 
//reducer 'receivedPhotos' according to the data received
const receivePhotos = (data) => {
	console.log('data: ', data);
	//if there is no error
	//set the photos obj
	if (data.stat !== 'fail') {
		return {
			type: RECEIVE_PHOTOS,
			photos: data.photos.photo
		}
	}

	//if there is an error
	//set the error message
	else {
		console.log('api error');
		return {
			type: API_CALL_FAIL,
			message: data.message
		}
	}
}

//dispatched from 'App' component in two situations:
//inside 'componentDidMount' when the page first loads
//and inside 'componenteWillReceiveProps' if there is a search and 
//the new keyword is different than the previous
export const fetchPhotos = (keyword='') => {
	return (dispatch, getState) => {
		
		//inform UI that an API request is about to be sent
		//UI changes to inform the user images are loading
		dispatch(processingPhotos());
		
		//if there was a search, get images from 'searchPhotos' API
		//the keyword will be inserted into the URL for parameters 'text' and 'tag'
		if(keyword){
			return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1bec777cc5d61c24bcc22dc790d9690f&tags=${keyword}&text=${keyword}&format=json&nojsoncallback=1`)
			.then(response => response.json())
			.then(data => dispatch(receivePhotos(data)))
		}

		//if the app is loading for the first time,
		//get images from 'getRecent' API
		else {
			return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=430f7acd5b6fd9cb84c8b6c736e56d7e&format=json&nojsoncallback=1`)
			.then(response => response.json())
			.then(data => dispatch(receivePhotos(data)))
		}
	}
}


