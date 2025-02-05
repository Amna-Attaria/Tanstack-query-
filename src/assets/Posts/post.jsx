import React from 'react'
import {  useQuery} from '@tanstack/react-query'
import { Container, Card } from 'react-bootstrap';
const Post = () => {
    const {data} = useQuery({ queryKey: ['posts'], queryFn: async()=>
{
    try{
      const response = await fetch('https://dummyjson.com/posts');
      const json = await response.json();
      return json.posts;
      
       }
       catch(e)
       {
        console.error();
       }
} })
 
  return (
    <>
 <h1 className='text-center mt-5'>All POST Show By Using API</h1>
  {data?.map(({title,id,body})=>
  (
   
    <Container>
    <br />
  <Card key={id}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
      {body}
        </Card.Text>

      </Card.Body>
    </Card>
  </Container>
  ))}
    </>
  )
}

export default Post