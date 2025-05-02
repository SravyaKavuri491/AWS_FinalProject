import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Button, VStack, FormControl, FormLabel, Input, Flex, useToast, Spinner, HStack, Text } from '@chakra-ui/react';
import { Home, User, Calendar, MousePointer2, LogOut } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const toast = useToast();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTitleBarVisible, setIsTitleBarVisible] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profileuser', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const user = await response.json();
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load profile',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!userData.email) {
        throw new Error('No email found for user');
      }

      const response = await fetch('/api/updateuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
        }),
        credentials: 'include',
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid server response');
      }

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Update failed');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseEnter = () => setIsTitleBarVisible(true);
  const handleMouseLeave = () => setIsTitleBarVisible(false);
  const handleEventsClick = () => router.push('/events');
  const handleGhostCursor = () => document.body.style.cursor = "url('/ghost-cursor.png'), auto";
  const handleLogout = () => router.push('/logout');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  return (
    <Box 
      minH="100vh" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      bgImage="url('/images/profile.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      color="white"
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
            <Button variant="ghost" leftIcon={<Home size={20} />} onClick={() => router.push('/home')} color="white">
              Home
            </Button>
            <Button variant="ghost" leftIcon={<Calendar size={20} />} onClick={handleEventsClick} color="white">
              Events
            </Button>
            <Button variant="ghost" leftIcon={<MousePointer2 size={20} />} onClick={handleGhostCursor} color="white">
              Ghost Cursor
            </Button>
            <Button variant="ghost" leftIcon={<User size={20} />} onClick={() => router.push('/profile')} color="white">
              Profile
            </Button>
            <Button variant="ghost" leftIcon={<LogOut size={20} />} onClick={handleLogout} color="white">
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Profile Content with transparent orange background */}
      <Box 
        p={8} 
        pt="80px"
        minH="calc(100vh - 80px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="100%"
          maxW="2xl"
          p={8}
          bg="rgba(237, 137, 54, 0.2)" // Transparent orange
          backdropFilter="blur(8px)"
          borderRadius="lg"
          border="1px solid rgba(237, 137, 54, 0.3)"
          boxShadow="lg"
          color="white"
        >
          <Heading as="h1" size="xl" mb={6} textAlign="center">Profile</Heading>
          
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input 
                name="firstName" 
                value={userData.firstName} 
                onChange={handleChange}
                bg="rgba(0, 0, 0, 0.2)"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
                _hover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
                _focus={{ borderColor: 'orange.300', bg: 'rgba(0, 0, 0, 0.3)' }}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input 
                name="lastName" 
                value={userData.lastName} 
                onChange={handleChange}
                bg="rgba(0, 0, 0, 0.2)"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
                _hover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
                _focus={{ borderColor: 'orange.300', bg: 'rgba(0, 0, 0, 0.3)' }}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input 
                value={userData.email} 
                isDisabled
                bg="rgba(0, 0, 0, 0.2)"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input 
                name="phoneNumber" 
                value={userData.phoneNumber} 
                onChange={handleChange}
                bg="rgba(0, 0, 0, 0.2)"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
                _hover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
                _focus={{ borderColor: 'orange.300', bg: 'rgba(0, 0, 0, 0.3)' }}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input 
                name="address" 
                value={userData.address} 
                onChange={handleChange}
                bg="rgba(0, 0, 0, 0.2)"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="white"
                _hover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
                _focus={{ borderColor: 'orange.300', bg: 'rgba(0, 0, 0, 0.3)' }}
              />
            </FormControl>
            
            <Button 
              onClick={handleSave} 
              colorScheme="orange" 
              mt={4}
              isLoading={isSaving}
              loadingText="Saving..."
              variant="solid"
            >
              Save Changes
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}