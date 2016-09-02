/*-------------------
   Imports
--------------------*/
import React, { PropTypes, Component } from 'react'
import Photo from './Photo'

/*-------------------------------------
   PhotoList presentational component
--------------------------------------*/
//loops over the photos object retrived from Flickr
//'builds' the URLs and passes as props to 'Photo' component
//which renders individual images
export default class PhotoList extends Component {
  render() {
    const { photosObj, keyword } = this.props;
    console.log('photosObj.photos: ', photosObj.photos)
      return(
        <article> 
          <h2 className='header'>Flickr Photo Wall App</h2>
          {!keyword &&
            <h3 className='getRecent_header'>Showing results from getRecent API</h3>
          }
          {keyword &&
            <h3 className="searchPhotos_header">Showing results for {keyword}</h3>
          }
          {photosObj.photos.map((photo, index) =>
            <Photo 
              key={index} 
              className="imageWrapper"
              href={"https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg"}
              imgClassName={"images"} 
              src={"https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg"} 
              alt={photo.title} />
          )}
        </article>
      );
  }
}

PhotoList.propTypes = {
  photosObj: PropTypes.object.isRequired,
  keyword: PropTypes.string
}
