import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader textAlign="center" color="green.400">
          Registration Successful!
        </ModalHeader>
        
        <ModalBody>
          <VStack spacing={4} py={4}>
            <Icon as={CheckCircle} w={12} h={12} color="green.400" />
            <Text textAlign="center">
              Your event registration is complete! A confirmation email has been sent to your registered email address.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button colorScheme="green" onClick={onClose}>
            Back to Events
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}