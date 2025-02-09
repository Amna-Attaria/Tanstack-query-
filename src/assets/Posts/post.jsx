import React from 'react'
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Container, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const Post = () => {

  const queryClient = useQueryClient();
// ---------------- Is Sa post fetch karwai ha ---------
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch('https://dummyjson.com/posts');
        const json = await response.json();
        return json.posts;
      } catch (e) {
        console.error(e);
      }
    }
  });


// ---------------- Is Sa post delete karwai ha ---------


  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
          method: 'DELETE',
        });
        return response.json();
      } catch (e) {
        console.error(e);
      }
    },
    onSuccess: (data , postId) => {
      console.log(data);
      queryClient.setQueryData(['posts'] , (curEl) =>
      {
        return curEl.filter((Post) => Post.id !== postId);
      })

    },

  });

  //----------------- Is Sa post delete karwai ha --------------------

  const UpdatePostMutation = useMutation({
    mutationFn: async ({postId,title,body}) => {
      try {
         const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title , body})
        });
        return response.json();
      } catch (e) {
        console.error(e);
      }
    },
    onSuccess: (updatedPost) => {
      console.log(data);
      queryClient.setQueryData(['posts'] , (curEl) =>
      {
        return curEl.map((post) =>(post.id === updatedPost.id ? updatedPost : post));
      })

    },

  });

  const handleUpdate  = (postId , currentTitle , currentBody)=>
  {
    const newTitle = prompt("Enter new title", currentTitle);
    const newBody = prompt("Enter new body", currentBody);
    if(newTitle!== null && newBody !== null){
      UpdatePostMutation.mutate({postId,title:newTitle,body:newBody})
    }
  }
  const [isVisible, setIsVisible] = useState(false);
  // -------------- Create Post ----------
const CreatePostMutation = useMutation({
  mutationFn: async (newPost) => {
    try {
      const response = await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      return response.json();
    } catch (e) {
      console.error(e);
    }
  },
  onSuccess: (newPost) => {
    queryClient.setQueryData(['posts'], (oldPosts) => (oldPosts ? [newPost, ...oldPosts] : [newPost]));

  },

});


const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (title && body) {
      CreatePostMutation.mutate({ title, body, userId: 1 }); // Adding a new post
      setTitle('');
      setBody('');
      setIsVisible(false);
    } else {
      alert('Title and Description are required');
    }
  };

  return (
    <>
      <h1 className='text-center mt-5'>All POST Show By Using API</h1>
        {/* ----------- FORM START TO CREATE A POST ----------- */}
      <div className="container text-center mt-5">
      <Button 
        variant="primary" 
        className="d-flex m-auto mt-4" 
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Hide " : "Create Post"}
      </Button>
      <div className={`card w-50 mx-auto mt-3 p-3 ${isVisible ? "" : "d-none"}`}>
        <Form onSubmit={handleCreatePost}>
        <Form.Group className="mb-3">
  <Form.Label>Title</Form.Label>
  <Form.Control 
    type="text" 
    placeholder="Enter Post Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)} 
  />
</Form.Group>


<Form.Group className="mb-3">
  <Form.Label>Description:</Form.Label>
  <textarea 
    id="description" 
    className="form-control" 
    rows="3" 
    placeholder="Enter Post Description"
    value={body}
    onChange={(e) => setBody(e.target.value)}
  ></textarea>
</Form.Group>


          <Button variant="primary" type="submit" className="d-flex m-auto">
            Post
          </Button>
        </Form>
      </div>
    </div>
 
      {data?.map(({ title, id, body }) => (
        <Container key={id}>
          <br />
          <Card>
            <Card.Body>
              <Card.Title>{id} {title}</Card.Title>
              <Card.Text>{body}</Card.Text>
              <button  className="btn btn-danger mx-3 mt-2 "
                onClick={() => {
                  deletePostMutation.mutate(id);
                }}
              >
                Delete
              </button>
              <button onClick={()=>handleUpdate(id,title,body)} className="btn btn-success mx-3 mt-2 ">Update</button>
            </Card.Body>
          </Card>
        </Container>
      ))}
    </>
  );
}

export default Post;
