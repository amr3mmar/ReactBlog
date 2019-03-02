import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions/postActions';
import { PostComments } from './PostComments'

class Home extends Component {
  constructor(props){
    super(props)
    if(!localStorage.getItem('currentUser'))
      props.history.push('/')

    this.state={}
    this.onChange = this.onChange.bind(this);
    this.gotoAddPost = this.gotoAddPost.bind(this);
    this.logout = this.logout.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  componentWillMount() {
    this.props.fetchPosts();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  gotoAddPost() {
    this.props.history.push('/add-post')
  }

  addComment(index){
    var body = this.state[index]
    if(!body)
      return
    var comment = {
      email: JSON.parse(localStorage.getItem("currentUser")).email,
      name: JSON.parse(localStorage.getItem("currentUser")).name,
      body: body
    }
    
    this.props.posts[index].comments.push(comment)
    localStorage.setItem("posts", JSON.stringify(this.props.posts))
    this.forceUpdate()
  }

  logout(){
    localStorage.removeItem("currentUser")
  }

  render() {
    var postItems
    if(this.props.posts)
      postItems = this.props.posts.map((post, index) => (
        <div key={index}>
          <div style={{width: 'fit-content', backgroundColor: '#d3d3d3', padding: '10px', borderRadius: '20px'}}>
            <h3 style={{margin: '2px'}}>{JSON.parse(post.user).name}: {post.title}</h3>
            <p style={{margin: '2px'}}>{post.body}</p>
          </div>
          <br></br>
          <div style={{marginLeft: "5%", width: 'fit-content'}}>
            <PostComments comments={post.comments}></PostComments>
          </div>
          <textarea onChange={this.onChange} name={index}></textarea>
          <br></br>
          <button className="button" onClick={()=>this.addComment(index)}>Comment</button>
          <hr></hr>
        </div>
      ));
    var logoutButton
    var currentUser = JSON.parse(localStorage.getItem("currentUser"))
    if(currentUser){
      logoutButton =
      <div>
        <a className='button' style={{backgroundColor: 'red', float:"right", marginLeft:'10px', fontSize:'14px', textDecoration: 'none'}}
         onClick = {this.logout} href="/">Logout</a>
      </div>
    }
    return (
      <div>
        {logoutButton}
        <button className='button' style={{backgroundColor: 'blue', float:"right"}} onClick = {this.gotoAddPost}>Add post</button>
        <h1 style={{textAlign: "center"}}>Posts</h1>  
        <div style={{clear: 'both'}}></div>
        <br></br>
        {postItems}
      </div>
    );
  }
}

Home.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  newPost: PropTypes.object
};

const mapStateToProps = state => ({
  posts: state.posts.items,
  newPost: state.posts.item
});

export default connect(mapStateToProps, { fetchPosts })(Home);
