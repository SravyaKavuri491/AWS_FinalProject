import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { Home, User, Calendar, MousePointer2, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const router = useRouter();

  // Mock registered events (replace with actual data from localStorage or API)
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // State to control the visibility of the title bar
  const [isTitleBarVisible, setIsTitleBarVisible] = useState(false);

  useEffect(() => {
    const savedRegisteredEvents = localStorage.getItem('registeredEvents');
    if (savedRegisteredEvents) {
      setRegisteredEvents(JSON.parse(savedRegisteredEvents));
    }
  }, []);

  // Countdown timer logic
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (registeredEvents.length > 0) {
      const eventDate = new Date(registeredEvents[0].date).getTime(); // Use the first registered event's date
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance > 0) {
          setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
          setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
          setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
          setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [registeredEvents]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleGhostCursor = () => {
    document.body.style.cursor = "url('/ghost-cursor.png'), auto";
  };

  const handleEventsClick = () => {
    router.push('/events'); // Route to the events page
  };

  // Handle mouse entering the top of the page
  const handleMouseEnter = () => {
    setIsTitleBarVisible(true);
  };

  // Handle mouse leaving the top of the page
  const handleMouseLeave = () => {
    setIsTitleBarVisible(false);
  };

  return (
    <Box
      minH="100vh"
      bgImage="url('/images/wallpaper.jpg')" // Replace with your wallpaper image
      bgSize="cover"
      bgPosition="center"
      color={textColor}
    >
      {/* Navigation Bar */}
      <Box
        as="nav"
        position="fixed"
        w="100%"
        zIndex={50}
        bg="purple.900"
        bgOpacity={0.8}
        backdropFilter="blur(8px)"
        transition="opacity 0.3s ease-in-out"
        opacity={isTitleBarVisible ? 1 : 0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Flex px={6} py={4} justify="space-between" align="center">
        <HStack spacing={2}>
          <Home size={24} color="white" />
          <Button 
            variant="unstyled" 
            fontSize="xl" 
            fontWeight="bold" 
            color="white"
            onClick={() => router.push('/dashboard')}
            _hover={{ color: 'purple.200' }}
          >
            Halloween Fest
          </Button>
        </HStack>
          <HStack spacing={6}>
            <Button variant="ghost" leftIcon={<Home size={20} />} onClick={() => router.push('/home')}>
              Home
            </Button>
            <Button variant="ghost" leftIcon={<Calendar size={20} />} onClick={handleEventsClick}>
              Events
            </Button>
            <Button variant="ghost" leftIcon={<MousePointer2 size={20} />} onClick={handleGhostCursor}>
              Ghost Cursor
            </Button>
            <Button variant="ghost" leftIcon={<User size={20} />} onClick={() => router.push('/profile')}>
              Profile
            </Button>
            <Button variant="ghost" leftIcon={<LogOut size={20} />} onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} align="center" textAlign="center">
          {/* Coming Soon Text */}
          <Heading as="h2" size="xl" fontFamily="'Creepster', cursive">
            We're Coming Soon
          </Heading>

          {/* Description */}
          {registeredEvents.length > 0 ? (
            <Text fontSize="lg" maxW="2xl">
              Countdown to your registered event: {registeredEvents[0].title}
            </Text>
          ) : (
            <Text fontSize="lg" maxW="2xl">
              Register for events to enjoy your day on Halloween! 🎃
            </Text>
          )}

          {/* Countdown Timer */}
          {registeredEvents.length > 0 ? (
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={6}
              mt={8}
              fontFamily="'Creepster', cursive"
            >
              <Box textAlign="center">
                <Text fontSize="4xl" fontWeight="bold">
                  {days}
                </Text>
                <Text fontSize="lg">DAYS</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="4xl" fontWeight="bold">
                  {hours}
                </Text>
                <Text fontSize="lg">HOURS</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="4xl" fontWeight="bold">
                  {minutes}
                </Text>
                <Text fontSize="lg">MINUTES</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="4xl" fontWeight="bold">
                  {seconds}
                </Text>
                <Text fontSize="lg">SECONDS</Text>
              </Box>
            </Flex>
          ) : (
            <Text fontSize="lg" color="gray.300" mt={8}>
              No events registered yet. Click <Button variant="link" color="orange.500" onClick={handleEventsClick}>here</Button> to register for events!
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;