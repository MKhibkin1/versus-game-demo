import './explore.scss'

import {Component} from 'react'
import {connect} from 'react-redux'

import SearchBar from "material-ui-search-bar";
import ImageCard from 'components/image-card/image-card'
import LikedImagesDisplay from 'components/liked-images-display/liked-images-display'

class ConnectedExplore extends Component{

    state = {
        images: [],
        searchQuery: "",
        searchExecuted: false
    }

    queryUnsplash = () => {
        const APP_ID = '_rkz0F3PdhpQYz1ISXculGEP6Y_MdFe2q2Hmk3M-RDk'
        fetch(`https://api.unsplash.com/search/photos/?page=1&per_page=60&query=${this.state.searchQuery}&client_id=${APP_ID}`)
        .then(resp => resp.json())
        .then(data => this.setState({images: data.results, searchExecuted: true}))
    }

    renderImages = () => {
        return(
            this.state.images.map((image ,index) => {
                return <ImageCard key={index} image={image} liked={image.id in this.props.likedImages}/>
            })
        )
    }
    
    conditionalRenderImagesOnQuery = () => {

        if(this.state.searchExecuted && this.state.images.length == 0){
            return(
                <div className="info-message">
                    No Images found with those search terms
                </div>

            )
        }
        if(this.state.images.length == 0){
            return(
                <div className="info-message">Images Will be displayed here when you search</div>
            )
        }

        return this.renderImages()
    }

    render(){
        return(
            <div className="explore-container">
                <div className="liked-images-container">
                    <LikedImagesDisplay />
                </div>
                    
                <div className="search-bar">
                    <SearchBar
                        value={this.state.searchQuery}
                        onChange={(newValue) => this.setState({ searchQuery: newValue })}
                        onCancelSearch={() => this.setState({images: [], searchExecuted: false})}
                        onRequestSearch={this.queryUnsplash}
                        placeholder="Search Unsplash For Images"
                    />
                </div>

                <div className="images-container">
                    <div className="images">
                        {this.conditionalRenderImagesOnQuery()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return(
        {
            likedImages: state.users[state.currentUser].likedImages
        }
    )
}

const mapDispatchToProps = (dispatch) => ({
    toggleImageLike: (imageID) => dispatch({type:"TOGGLE_IMAGE_LIKE", imageID}),
})

const Explore = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedExplore)

export default Explore

