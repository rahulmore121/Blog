import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import "./Posts.css";
import Post from "../../components/Posts/Post";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axiosPrivate.get(`/api/v1/post/user`);
        setPosts(response.data.data);
        console.log(response);
      } catch (error) {
        dispatch(logout());
        navigate("/", { replace: true });
      }
    };
    getPost();
  }, []);

  return (
    <div className="user-post-main">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            title={post.name}
            description={post.description}
            isShown={true}
            id={post._id}
          />
        ))
      ) : (
        <div>No Posts Found</div>
      )}
    </div>
  );
};

export default Posts;
