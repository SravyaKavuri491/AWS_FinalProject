import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  Flex,
  Text,
  Input,
  Textarea,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  HStack,
  Container,
} from '@chakra-ui/react';
import { Home, User, Calendar, MousePointer2, LogOut, HelpCircle, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

interface Event {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const [feedback, setFeedback] = useState('');
  const [issue, setIssue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isHelpDeskOpen, onOpen: onHelpDeskOpen, onClose: onHelpDeskClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userIssue, setUserIssue] = useState('');

  const events: Event[] = [
    {
      id: 1,
      name: 'Haunted House Escape room',
      description: 'Experience spine-chilling thrills in our meticulously crafted haunted mansion.',
      fullDescription: 'Step into a world of terror in our legendary haunted mansion. Navigate through dark corridors, encounter supernatural entities, and uncover the dark secrets that lurk within these haunted walls. This immersive experience features professional actors, state-of-the-art special effects, and historically inspired set designs.',
      date: '2023-10-31',
      time: '7:00 PM',
      location: '123 Spooky Lane',
      image: '/images/haunted-house.jpg',
    },
    {
      id: 2,
      name: 'Pumpkin Carving Workshop',
      description: 'Learn to carve the perfect pumpkin.',
      fullDescription: 'Learn the art of pumpkin carving from expert artists. From traditional faces to intricate designs, discover techniques to bring your Halloween vision to life. All materials provided, including premium carving tools and locally sourced pumpkins. Perfect for families and enthusiasts alike.',
      date: '2023-10-28',
      time: '2:00 PM',
      location: '456 Pumpkin Ave',
      image: '/images/pumpkin-carving.jpg',
    },
    {
      id: 3,
      name: 'Halloween Costume Party',
      description: 'Dress up and join the party!',
      fullDescription: 'The highlight of the Halloween season! Join us for an unforgettable night of music, dancing, and costume competitions. Featuring live DJ, professional photographers, themed cocktails, and prizes for best costumes in multiple categories. Don\'t miss the midnight parade of costumes!',
      date: '2023-10-30',
      time: '8:00 PM',
      location: '789 Costume Blvd',
      image: '/images/costume-party.jpg',
    },
  ];

  // Separate array of images for the carousel
  const carouselImages = [
    '/images/carousel1.jpg',
    '/images/carousel2.jpg',
    '/images/carousel3.jpg',
  ];

  const handleLogout = () => {
    router.push('/');
  };

  const handleGhostCursor = () => {
    document.body.style.cursor = "url('/ghost-cursor.png'), auto";
  };

  const handleHomeClick = () => {
    router.push('/home');
  };

  const handleEventsClick = () => {
    router.push('/events');
  };

  const handleSubmitFeedback = async () => {
    if (feedback.trim() === '' || issue.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please fill in both feedback and issue fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Your feedback has been submitted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setFeedback('');
    setIssue('');
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleHelpDeskSubmit = async () => {
    if (!name || !email || !userIssue) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          issue: userIssue,
          content: feedback
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      onHelpDeskOpen();
      setName('');
      setEmail('');
      setUserIssue('');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your feedback. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box minH="100vh" bg="black" color="white">
      {/* Navigation Bar */}
      <Box
        as="nav"
        position="fixed"
        w="100%"
        zIndex={50}
        bg="purple.900"
        bgOpacity={0.8}
        backdropFilter="blur(8px)"
      >
        <Flex px={6} py={4} justify="space-between" align="center">
          <HStack spacing={2}>
            <Home size={24} />
            <Text fontSize="xl" fontWeight="bold">Halloween Fest</Text>
          </HStack>
          <HStack spacing={6}>
            <Button variant="ghost" leftIcon={<Home size={20} />} onClick={handleHomeClick}>
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
      <Container maxW="container.xl" pt="20" px={6}>
        {/* Wallpaper Carousel */}
        <Box mb={8}>
          <Slider {...settings}>
            {carouselImages.map((image, index) => (
              <Box key={index} textAlign="center">
                <Box
                  position="relative"
                  width="100%"
                  height={{ base: '300px', md: '500px' }}
                  overflow="hidden"
                  borderRadius="xl"
                >
                  <Image
                    src={image}
                    alt={`Carousel Image ${index + 1}`}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
                <Text mt={2} fontSize="lg" fontWeight="bold">{events[index].name}</Text>
                <Text>{events[index].description}</Text>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Events Section */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={20}>
          {events.map((event) => (
            <Box
              key={event.id}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleEventClick(event)}
              transition="transform 0.2s"
              _hover={{ '& > img': { transform: 'scale(1.1)' } }}
            >
              <Image
                src={event.image}
                alt={event.name}
                h="300px"
                w="full"
                objectFit="cover"
                transition="transform 0.2s"
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-t, blackAlpha.900, transparent)"
                p={6}
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Heading as="h3" size="lg" mb={2}>{event.name}</Heading>
                <Text color="gray.300">{event.description}</Text>
                <Box position="absolute" bottom={4} right={4}>
                  <ChevronRight size={24} color="orange" />
                </Box>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* About Section */}
        <Box
          maxW="4xl"
          mx="auto"
          mb={20}
          p={8}
          borderRadius="2xl"
          bgImage="url('https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200')"
          bgSize="cover"
          bgPosition="center"
        >
          <Box
            bg="blackAlpha.700"
            backdropFilter="blur(8px)"
            borderRadius="xl"
            p={8}
          >
            <Heading as="h2" size="xl" mb={6} color="orange.400">
              About Halloween Fest
            </Heading>
            <Text fontSize="lg" color="gray.200" lineHeight="tall">
              Welcome to the most spectacular Halloween celebration of the year! Our carefully curated events bring together 
              the perfect blend of spooky entertainment, creative activities, and thrilling experiences. Whether you're a 
              thrill-seeker looking for scares in our Haunted House, an artist ready to create the perfect jack-o'-lantern, 
              or a party-goer excited to show off your costume, we have something for everyone.
            </Text>
          </Box>
        </Box>

        {/* Help Desk Section */}
        <Box
          maxW="4xl"
          mx="auto"
          mb={20}
          p={8}
          borderRadius="2xl"
          bg="purple.900"
          bgOpacity={0.3}
          backdropFilter="blur(8px)"
        >
          <HStack spacing={4} mb={6}>
            <HelpCircle size={32} color="orange" />
            <Heading as="h2" size="xl" color="orange.400">Help Desk</Heading>
          </HStack>
          <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
            <Box flex="1">
              <Text fontSize="lg" color="gray.200" mb={6}>
                If you're facing any issues or have questions, feel free to reach out to us. Our support team is available 
                to assist you via email or phone. You can also fill out the form below, and we'll get back to you within 24 hours.
              </Text>
              <Box bg="purple.950" bgOpacity={0.5} p={6} borderRadius="xl">
                <Heading as="h3" size="md" mb={3}>Contact Information</Heading>
                <Text color="gray.300">Email: support@halloweenfest.com</Text>
                <Text color="gray.300">Phone: (555) 123-4567</Text>
              </Box>
            </Box>

            <Box flex="1">
              <VStack spacing={6} align="stretch">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                />
                <Input
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                />
                <Textarea
                  placeholder="Describe the issue you're facing..."
                  value={userIssue}
                  onChange={(e) => setUserIssue(e.target.value)}
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                />
                <Button
                  colorScheme="purple"
                  onClick={handleHelpDeskSubmit}
                  isDisabled={!name || !email || !userIssue}
                >
                  Submit
                </Button>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Container>

      {/* Event Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent bg="purple.900" bgOpacity={0.9}>
          {selectedEvent && (
            <>
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.name}
                h="300px"
                w="full"
                objectFit="cover"
              />
              <ModalCloseButton />
              <ModalBody p={8}>
                <Heading as="h2" size="xl" mb={4}>{selectedEvent.name}</Heading>
                <Text fontSize="lg" color="gray.200" lineHeight="tall" mb={6}>
                  {selectedEvent.fullDescription}
                </Text>
                <Button variant="solid" onClick={onClose}>
                  Close
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Help Desk Confirmation Pop-up */}
      <Modal isOpen={isHelpDeskOpen} onClose={onHelpDeskClose} isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent bg="purple.900" bgOpacity={0.9}>
          <ModalCloseButton />
          <ModalBody p={8}>
            <Heading as="h2" size="xl" mb={4}>Thank You!</Heading>
            <Text fontSize="lg" color="gray.200" lineHeight="tall" mb={6}>
              Your issue has been submitted. Our support team will get back to you within 24 hours.
            </Text>
            <Button variant="solid" onClick={onHelpDeskClose}>
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}