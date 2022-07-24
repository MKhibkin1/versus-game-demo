import './image-card.scss'

import {Component} from 'react'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {connect} from 'react-redux'

class ConnectedImageCard extends Component{
    
    toggleLike = () => {

        fetch('http://localhost:8000/users/', {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => resp.json())
        .then(users => {
            let updatedUsers = {...users}
            let updatedUser = {...updatedUsers[this.props.currentUser]}
            let likedImages = {...updatedUser.likedImages}

            // update on Backend
            if(this.props.image.id in likedImages){
                delete likedImages[this.props.image.id]
            }else{
                likedImages[this.props.image.id] = this.props.image.id
            }

            updatedUser.likedImages = likedImages
            updatedUsers[this.props.currentUser] = updatedUser

            fetch('http://localhost:8000/users/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUsers),
            })
            .then(response => response.json())
            .then(data => 
                //update in state
                this.props.updateLikedImages(data[this.props.currentUser].likedImages)
            )

        })
    }

    render(){
        return(
            <div className="card-container">
                <Card className="card">
                    <CardMedia
                        component="img"
                        image={this.props.image.urls.small}
                        alt="Unsplash Image"
                    />
                    <CardContent className="description">
                        <Typography variant="body2" color="text.secondary">
                            {this.props.image.description ?? "No description"}
                        </Typography>
                    </CardContent>
                    <CardActions className="actions" disableSpacing>
                        <IconButton aria-label="add to favorites" onClick={this.toggleLike}>
                            <FavoriteIcon   sx={{ 
                                color: this.props.liked? "red" : "black", 
                            }}/>
                        </IconButton>
                    </CardActions>
                </Card>     
            </div>
  

        )
    }
}


const mapStateToProps = (state) => {
    return(
        {
            loggedIn: state.loggedIn,
            currentUser: state.currentUser,
            users: state.users
        }
    )
}

const mapDispatchToProps = (dispatch) => ({
    updateLikedImages: (images) => dispatch({type: "UPDATE_LIKED_IMAGES", images})
})

const ImageCard = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedImageCard)

export default ImageCard