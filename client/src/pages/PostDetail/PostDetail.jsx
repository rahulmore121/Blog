// import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useLoaderData } from "react-router-dom";
import PostForm from "../../components/PostForm/PostForm";
const PostDetail = () => {
  // const { id } = useParams();
  const post = useLoaderData();
  if (post.status === 404) {
    return <div>{post.message}</div>;
  }
  return <PostForm />;
};

export const loader = async ({ params }) => {
  try {
    const post = await axiosPrivate.get(`/api/v1/post/user/${params.id}`);
    return post;
  } catch (error) {
    return { message: error.response.data.msg, status: 404 };
  }
};

export default PostDetail;
