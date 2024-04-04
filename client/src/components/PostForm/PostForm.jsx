import { useState } from "react";
import "./PostForm.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const PostForm = () => {
  const [postDetail, setPostDetail] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const [postImg, setPostImg] = useState(null);
  const addDetailsHandler = (e) => {
    setPostDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formdata = new FormData();
  formdata.append("post", postImg);
  formdata.append("name", postDetail.name);
  formdata.append("description", postDetail.description);
  const createPostHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(`/api/v1/post`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="form-container">
      <form onSubmit={createPostHandler} className="form-item">
        <div className="form-items">
          <input
            type="text"
            placeholder="name"
            onChange={addDetailsHandler}
            name="name"
          />
        </div>
        <div className="form-items">
          <input
            type="text"
            name="description"
            placeholder="description"
            onChange={addDetailsHandler}
          />
        </div>
        <div className="form-items">
          <input
            type="file"
            name="post"
            id=""
            onChange={(e) => {
              setPostImg(e.target.files[0]);
            }}
          />
        </div>
        <div className="form-items btn">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
