import { Link } from "react-router-dom";
import "./Post.css";
import PropTypes from "prop-types";

const Post = ({ title, description, isShown, id }) => {
  return (
    <div className="post-main">
      <div className="post-img">img</div>
      <div className="post-sec">
        <div className="post-title">{title}</div>
        <div className="post-desc">{description}</div>
        {isShown && <Link to={`${id}`}>update</Link>}
        {isShown && <div>delete</div>}
      </div>
    </div>
  );
};
Post.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired, // Add description prop validation
  isShown: PropTypes.bool.isRequired,
  id: PropTypes.string,
};

export default Post;
