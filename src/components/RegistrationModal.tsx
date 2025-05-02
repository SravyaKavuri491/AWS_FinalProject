import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';

export default function RegistrationModal({ isOpen, onClose, event, onComplete }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch user data from the backend when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  // Function to fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/profileuser', {
        credentials: 'include', // Include credentials for authentication
      });

      if (!response.ok) {
        console.error('Failed to fetch user details');
        return;
      }

      const user = await response.json();

      // Set user data in state
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });

      // Set editable fields in state
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phoneNumber || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader color="halloween.orange">{event.title} Registration</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            {/* First Name Field */}
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                bg="gray.700"
              />
            </FormControl>

            {/* Last Name Field */}
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                bg="gray.700"
              />
            </FormControl>

            {/* Email Field (Non-Editable) */}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={userData.email}
                isReadOnly
                bg="gray.700"
                opacity={0.8}
              />
            </FormControl>

            {/* Phone Field */}
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                bg="gray.700"
              />
            </FormControl>

            {/* Registration Cost */}
            <Text fontSize="lg" fontWeight="bold" color="halloween.orange">
              Registration Cost: ${event.cost}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={onComplete}>
            Proceed to Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}