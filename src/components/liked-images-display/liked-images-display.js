import './liked-images-display.scss'

import {Component} from 'react'
import {connect} from 'react-redux'
import ImageCard from 'components/image-card/image-card'


class ConnectedLikedImagesDisplay extends Component{
    state = {
        images: []
    }

    componentDidMount = () => {
        const APP_ID = '_rkz0F3PdhpQYz1ISXculGEP6Y_MdFe2q2Hmk3M-RDk'
        let promises = Object.keys(this.props.likedImages).map(id => 
            fetch(`https://api.unsplash.com/photos/${id}?client_id=${APP_ID}`)
            .then(resp => resp.json())
            .catch(error => console.log(error))
            .then(data => data)
        )

        Promise.all(promises)
        .then((images) => this.setState({images}))
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.likedImages !== this.props.likedImages){
            
            //Remove stale images
            this.setState({images: this.state.images.filter(img => img.id in this.props.likedImages)})            

            //Add new images
            const APP_ID = '_rkz0F3PdhpQYz1ISXculGEP6Y_MdFe2q2Hmk3M-RDk'

            let newImages = Object.keys(this.props.likedImages).map(id => {
                if(!prevProps.likedImages[id])
                {
                    return fetch(`https://api.unsplash.com/photos/${id}?client_id=${APP_ID}`)
                    .then(resp => resp.json())
                    .catch(error => console.log(error))
                    .then(data => data)
                }
            })

            Promise.all(newImages.filter( (img) => img  ))
            .then((newImgs) => this.setState({images: [...this.state.images, ...newImgs]}) )
        }
    }


    renderImages = () => {

        if(this.state.images.length ==0){
            return(
            <div>
                When you like an image it will appear here
            </div>)
        }

        return(
            this.state.images.map((image, index) =>
               <ImageCard key={index} image={image} liked={true}/>
            )
        )
    }

    render(){
        return(
            <div className="liked-images">
                <h3>My Liked Images</h3>
                <div className="images-wrapper">
                    {this.renderImages()}
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return(
        {
            likedImages: state.users[state.currentUser].likedImages,
        }
    )
}


const LikedImagesDisplay = connect(
    mapStateToProps,
    null
)(ConnectedLikedImagesDisplay)
  
export default LikedImagesDisplay
