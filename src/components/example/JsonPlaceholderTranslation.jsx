"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function JsonPlaceholderTranslation() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get translations from Redux
  const messages = useSelector((state) => state.language.messages);
  const jsonPlaceholderTranslations = messages?.jsonPlaceholder || {};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {jsonPlaceholderTranslations.errorMessage ||
          "An error occurred while fetching data"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {jsonPlaceholderTranslations.pageTitle || "JSON Placeholder Posts"}
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold capitalize">
                {post.title.length > 20
                  ? `${post.title.slice(0, 20)}...`
                  : post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {post.body.length > 100
                  ? `${post.body.slice(0, 100)}...`
                  : post.body}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {jsonPlaceholderTranslations.postId || "Post"} #{post.id}
                </span>
                <span className="text-sm text-gray-500">
                  {jsonPlaceholderTranslations.userId || "User"} {post.userId}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default JsonPlaceholderTranslation;
