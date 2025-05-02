import React, { useState } from 'react';
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
  HStack,
  Text,
} from '@chakra-ui/react';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  event, 
  onComplete, 
  onError,
  isLoading 
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleSubmit = () => {
    // Basic format validation only (no real card validation)
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      onError('Please enter a 16-digit card number');
      return;
    }

    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      onError('Please enter expiry in MM/YY format');
      return;
    }

    if (!cardCvc || cardCvc.length < 3) {
      onError('Please enter a 3-digit CVV');
      return;
    }

    // Pass the entered details (no real processing)
    onComplete({
      cardNumber,
      cardExpiry,
      cardCvc
    });
  };

  // Simple formatting for better UX
  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length > 16) return cardNumber; // Prevent exceeding 16 digits
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader>Mock Payment Details</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text fontWeight="bold">
              Amount to Pay: ${event?.cost?.toFixed(2) || '0.00'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              (This is a mock payment - no real transaction will occur)
            </Text>

            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19} // 16 digits + 3 spaces
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Expiry Date (MM/YY)</FormLabel>
                <Input
                  placeholder="12/25"
                  value={cardExpiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setCardExpiry(value);
                  }}
                  maxLength={5}
                />
              </FormControl>

              <FormControl>
                <FormLabel>CVV</FormLabel>
                <Input
                  placeholder="123"
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                  maxLength={3}
                />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Complete Mock Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}