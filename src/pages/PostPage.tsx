// src/pages/PostsPage.tsx
import React, { useEffect, useState } from "react";
import AddPostModal from "../components/posts/AddPostModal";
import EditPostModal from "../components/posts/EditPostModal";
import PostList from "../components/posts/PostList";
import { fetchPosts, deletePost } from "../services/api";
import { Post } from "../types/posts";
import LogoutButton from "../components/auth/logoutButton";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsData();
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => Number(post.id) !== postId));
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center border-b border-black pb-2">
        <h1 className="text-2xl font-bold ml-3">wwBlog</h1>
        <div className="flex items-center space-x-4 mr-3">
          <Link to="/Profile" className="flex items-center justify-center">
            <img
              src="https://static.thenounproject.com/png/1476975-200.png" // Замените на путь к аватарке
              alt="Profile"
              className="w-10 h-10 rounded-full" // Стили для аватарки
            />
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="p-5">
        <PostList
          posts={posts}
          onDeletePost={handleDeletePost}
          setPosts={setPosts}
          setIsEditModalOpen={setIsEditModalOpen}
          setEditingPost={setEditingPost}
        />

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 z-50"
        >
          +
        </button>
      </div>
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        setPosts={setPosts}
      />

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={editingPost}
        setPosts={setPosts}
      />
    </div>
  );
};

export default PostsPage;