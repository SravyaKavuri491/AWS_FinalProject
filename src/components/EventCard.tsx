import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    cost: number;
  };
  isRegistered: boolean;
  onClick: () => void;
}

export default function EventCard({ event, isRegistered, onClick }: EventCardProps) {
  return (
    <Box
      bg="rgba(0, 0, 0, 0.4)" // Transparent black background
      backdropFilter="blur(10px)" // Glassmorphic blur effect
      p={6}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="purple.300"
      boxShadow="lg"
      _hover={{ 
        transform: 'translateY(-4px)', 
        transition: 'all 0.2s',
        bg: 'rgba(0, 0, 0, 0.5)' // Slightly more opaque on hover
      }}
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="md" color="orange.300">
          {event.title}
          {isRegistered && (
            <Badge ml={2} colorScheme="green">
              Registered
            </Badge>
          )}
        </Heading>
        
        <Text color="gray.100">{event.description}</Text>
        
        <Box color="gray.200">
          <Text display="flex" alignItems="center" gap={2}>
            <Calendar size={16} /> {event.date}
          </Text>
          <Text display="flex" alignItems="center" gap={2}>
            <Clock size={16} /> {event.time}
          </Text>
          <Text display="flex" alignItems="center" gap={2}>
            <MapPin size={16} /> {event.location}
          </Text>
        </Box>
        
        <Text fontWeight="bold" color="orange.300">
          Cost: ${event.cost}
        </Text>
        
        <Button
          colorScheme="purple"
          variant={isRegistered ? "outline" : "solid"}
          onClick={onClick}
          isDisabled={isRegistered}
        >
          {isRegistered ? 'Already Registered' : 'Register Now'}
        </Button>
      </VStack>
    </Box>
  );
}
