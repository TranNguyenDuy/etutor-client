import { APIService } from "./api";

const createPost = (post) => {
  return APIService.post("/posts", post);
};

const getPosts = (type = "document") => {
  return APIService.get(`/posts/${type}`);
};

const comment = (postId, content) => {
  return APIService.post(`/posts/${postId}/comments`, {
    comment: { content },
  });
};

const deleteComment = (id) => {
  return APIService.delete(`/posts/comments/${id}`);
};

const getPostDetails = (id, type = "blog") => {
  return APIService.get(`/posts/${type}/${id}`);
};

const deletePost = (id) => {
  return APIService.delete(`/posts/${id}`);
};

const updatePost = (id, data) => {
  return APIService.patch(`/posts/${id}`, data);
};

export const PostService = {
  createPost,
  getPosts,
  comment,
  deleteComment,
  getPostDetails,
  deletePost,
  updatePost,
};
