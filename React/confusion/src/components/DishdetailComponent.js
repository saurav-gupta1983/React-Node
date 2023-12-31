import React, { Component } from 'react'
//import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle } from 'reactstrap';
import { Card, CardImg, CardText, CardBody, 
    CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

function RenderDish( {dish} ){        
    return(
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name}></CardImg>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments( {comments, postComment, dishId} ){

    if(comments == null){
        return(
            <div></div>
        );
    }
    else {
        return(
            <div className="col-12 col-md-5 m-1"> 
                <h4>Comments</h4>
                <ul className = "list-unstyled">
                    { 
                        comments.map((dishComment) => 
                        <li key={ dishComment.id }>
                            <p></p>
                            <p></p>
                            <p>{ dishComment.comment }</p>
                            <p></p>
                            <p>-- { dishComment.author }, { 
                                new Intl.DateTimeFormat('en-US', 
                                    { year: 'numeric', month: 'short', day: '2-digit'}).format(
                                        new Date(Date.parse(dishComment.date)))  
                                }
                            </p>
                        </li>
                    )
                    }
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        );
    }

}

const DishDetail = (props) => {

    if(props.isLoading){
        return(
            <div className="container">
                <div className = "row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess){
        
        return(
            <div className="container">
                <div className = "row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish!=null){

        return(
            <div className = "container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}></BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">                        
                    <RenderDish dish={props.dish}></RenderDish>
                    <RenderComments comments = {props.comments} 
                        postComment = {props.postComment}
                        dishId = {props.dish.id} />
                </div>
            </div>
        );
    }
}

export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => !(val) || (val.length >= len);

class CommentForm extends Component {

    constructor(props){
        super(props);

        this.state={
            isModalOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render(){
        return(

            <React.Fragment>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"> Submit Comment</span>
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>                    
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}>Rating</Label>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        className = "form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="author"
                                        className = "form-control"
                                        validators={{required, minLength: minLength(3), maxLength: maxLength(15)}}
                                        ></Control.text>
                                    <Errors className="text-danger" model=".author" show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greated than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }} ></Errors>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comment</Label>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        placeholder="yourname" rows="6"
                                        className = "form-control"
                                        ></Control.textarea>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" value="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}