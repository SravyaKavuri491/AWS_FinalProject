import { useRouter } from 'next/router';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;

  const event = {
    id,
    name: 'Haunted House Tour',
    date: 'October 31, 2023',
    location: 'Main Street',
    description: 'Explore a spooky haunted house with guided tours.',
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
          {event.name}
        </Heading>
        <Text mb={4}>{event.description}</Text>
        <Text mb={4}>
          {event.date} - {event.location}
        </Text>
        <VStack spacing={4}>
          <Button colorScheme="blue" w="full">
            Register
          </Button>
          <Button onClick={() => alert('Reminder set!')} w="full">
            Set Reminder
          </Button>
          <Button onClick={() => alert('Added to waitlist!')} w="full">
            Join Waitlist
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}