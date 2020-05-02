import React from "react";

class PostActions extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="post-action">
          <i className="fa fa-thumbs-o-up"></i> 2
        </div>
        <div className="post-action">
          <i className="fa fa-comment-o"></i>
        </div>
      </React.Fragment>
    );
  }
}

export default PostActions;
