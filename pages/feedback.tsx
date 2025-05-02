import { useState } from 'react';
import { Box, Heading, Text, Button, Textarea, VStack } from '@chakra-ui/react';

export default function Feedback() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`); // Show error message
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');
    }
  };

  return (
    <Box
      bgImage="url('/halloween.jpg')"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" maxW="md" w="full">
        <Heading as="h1" size="xl" mb={4}>
          Feedback
        </Heading>
        <VStack spacing={4}>
          <Textarea
            placeholder="Your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}