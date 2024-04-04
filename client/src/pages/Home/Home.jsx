import { useLoaderData } from "react-router-dom";
import Post from "../../components/Posts/Post";
import "./Home.css";
import axios from "../../api/axios";
import { json } from "react-router-dom";
const Home = () => {
  let loaderData = useLoaderData();
  console.log(loaderData);
  return (
    <div className="home-main">
      {loaderData && loaderData?.data ? (
        loaderData.data.map((post) => (
          <Post
            key={post._id}
            title={post.name}
            description={post.description}
            isShown={false}
          />
        ))
      ) : (
        <div>{loaderData}</div>
      )}
    </div>
  );
};

export const loader = async () => {
  try {
    const response = await axios.get(`/api/v1/post/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return json(error.message, { status: 500 });
  }
};

export default Home;
