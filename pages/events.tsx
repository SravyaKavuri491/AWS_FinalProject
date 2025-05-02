import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useDisclosure,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Text,
  Button,
  Input,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Home, User, Calendar, MousePointer2, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import EventCard from 'src/components/EventCard';
import EventMap from 'src/components/EventMap';
import RegistrationModal from 'src/components/RegistrationModal';
import PaymentModal from 'src/components/PaymentModal';
import SuccessModal from 'src/components/SuccessModal';

const events = [
  {
    id: 1,
    title: 'Halloween Night Party',
    description: 'Join us for a spooky night of fun and entertainment!',
    date: '2025-05-09',
    time: '8:00 PM',
    location: 'UNO Student Center',
    cost: 25,
    coordinates: { lat: 41.2587, lng: -96.0115 },
  },
  {
    id: 2,
    title: 'Haunted Campus Tour',
    description: 'Explore the haunted history of UNO campus!',
    date: '2025-05-10',
    time: '9:00 PM',
    location: 'UNO Main Campus',
    cost: 15,
    coordinates: { lat: 41.2582, lng: -96.0107 },
  },
  {
    id: 3,
    title: 'Costume Contest',
    description: 'Show off your best Halloween costume and win prizes!',
    date: '2025-05-11',
    time: '7:00 PM',
    location: 'UNO Arts Center',
    cost: 10,
    coordinates: { lat: 41.2590, lng: -96.0120 },
  },
];

export default function EventsPage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen: isRegOpen, onOpen: onRegOpen, onClose: onRegClose } = useDisclosure();
  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isGiftRegOpen, onOpen: onGiftRegOpen, onClose: onGiftRegClose } = useDisclosure();
  const [giftName, setGiftName] = useState('');
  const [giftEmail, setGiftEmail] = useState('');
  const [isTitleBarVisible, setIsTitleBarVisible] = useState(false);

  useEffect(() => {
    const savedRegisteredEvents = localStorage.getItem('registeredEvents');
    if (savedRegisteredEvents) {
      setRegisteredEvents(JSON.parse(savedRegisteredEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onRegOpen();
  };

  const handleRegistrationComplete = () => {
    onRegClose();
    onPayOpen();
  };

  const handlePaymentComplete = () => {
    onPayClose();
    onSuccessOpen();
    setRegisteredEvents([...registeredEvents, selectedEvent]);
  };

  const handlePaymentError = () => {
    setError('Payment failed. Please try again.');
    onPayClose();
  };

  const handleGiftRegistration = () => {
    console.log({ giftName, giftEmail });
    onGiftRegClose();
    onSuccessOpen();
    setGiftName('');
    setGiftEmail('');
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('registeredEvents');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleMouseEnter = () => {
    setIsTitleBarVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTitleBarVisible(false);
  };

  const handleGhostCursor = () => {
    document.body.style.cursor = "url('/ghost-cursor.png'), auto";
  };

  return (
    <Box
      minH="100vh"
      bg="gray.900"
      backgroundImage="url('/images/events.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
      display="flex"
      flexDirection="column"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');
        .spooky-font {
          font-family: 'Creepster', cursive;
          color: #FF6F61;
          letter-spacing: 1.5px;
        }
      `}</style>

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
            <Button variant="ghost" leftIcon={<Calendar size={20} />} onClick={() => router.push('/events')}>
              Events
            </Button>
            <Button variant="ghost" leftIcon={<MousePointer2 size={20} />} onClick={handleGhostCursor}>
              Ghost Cursor
            </Button>
            <Button variant="ghost" leftIcon={<User size={20} />} onClick={() => router.push('/profile')}>
              Profile
            </Button>
            <Button variant="ghost" leftIcon={<LogOut size={20} />} onClick={() => router.push('/')}>
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="container.md" py={8} position="relative" textAlign="left" pl={4} flex="1" mt={16}>
        <VStack spacing={8} align="flex-start">
          {error && (
            <Alert status="error" borderRadius="md" width="100%">
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Heading
            fontSize="6xl"
            textShadow="2px 2px 4px rgba(0,0,0,0.4)"
            className="spooky-font"
          >
            Spooky Events
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEvents.some(e => e.id === event.id)}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </SimpleGrid>

          <Flex direction={{ base: 'column', md: 'row' }} gap={6} width="100%">
            <Box
              bg="rgba(0, 0, 0, 0.6)"
              p={6}
              borderRadius="xl"
              borderWidth="2px"
              borderColor="#6B21A8"
              flex="1"
              backdropFilter="blur(8px)"
            >
              <Heading size="lg" mb={4} className="spooky-font">
                Event Map
              </Heading>
              <EventMap events={events} />
            </Box>

            <Box
              bg="rgba(0, 0, 0, 0.6)"
              p={6}
              borderRadius="xl"
              borderWidth="2px"
              borderColor="#6B21A8"
              flex="1"
              backdropFilter="blur(8px)"
            >
              <Heading size="lg" mb={4} className="spooky-font">
                Surprise Gift!
              </Heading>
              <Text color="gray.300" mb={4}>
                Register now to receive a surprise gift at the end of the event!
              </Text>
              <Button colorScheme="purple" onClick={onGiftRegOpen}>
                Register for Gift
              </Button>
            </Box>
          </Flex>
        </VStack>
      </Container>

      <Modal isOpen={isGiftRegOpen} onClose={onGiftRegClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader className="spooky-font">Register for Surprise Gift</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Enter your details to register for the surprise gift:
            </Text>
            <Input
              placeholder="Your Name"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              mb={4}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
            <Input
              placeholder="Your Email"
              value={giftEmail}
              onChange={(e) => setGiftEmail(e.target.value)}
              mb={4}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={handleGiftRegistration} isDisabled={!giftName || !giftEmail}>
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader className="spooky-font">Registration Successful!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Thank you for registering! You will receive a surprise gift at the end of the event.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onSuccessClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedEvent && (
        <>
          <RegistrationModal
            isOpen={isRegOpen}
            onClose={onRegClose}
            event={selectedEvent}
            onComplete={handleRegistrationComplete}
          />
          <PaymentModal
            isOpen={isPayOpen}
            onClose={onPayClose}
            event={selectedEvent}
            onComplete={handlePaymentComplete}
            onError={handlePaymentError}
          />
          <SuccessModal
            isOpen={isSuccessOpen}
            onClose={onSuccessClose}
          />
        </>
      )}
    </Box>
  );
}

