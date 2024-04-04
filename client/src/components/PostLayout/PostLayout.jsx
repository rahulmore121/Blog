import { Link, Outlet } from "react-router-dom";
const PostLayout = () => {
  return (
    <div>
      <div>
        <Link to="/post/create">Create Post</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default PostLayout;
