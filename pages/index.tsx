import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin); // Toggle between login and registration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login
      try {
        const response = await fetch('/api/validate_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          alert('Login successful!');
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
      }
    } else {
      // Handle registration
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
      };

      try {
        const response = await fetch('/api/create_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          alert('Registration successful! You can now log in.');
          setIsLogin(true); // Switch to login form after successful registration
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Box
      style={{
        backgroundImage: "url('/halloween.jpg')", // Background image for login page only
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        bg="rgba(255, 255, 255, 0.3)" // More transparent background
        backdropFilter="blur(8px)" // Blur effect
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="md"
        w="full"
        color="black" // Ensure text is black
        fontFamily="'Creepster', cursive" // Spooky font for the entire form
      >
        <Heading
          as="h1"
          size="xl"
          mb={4}
          textAlign="center"
          fontFamily="'Creepster', cursive" // Spooky font for the heading
        >
          {isLogin ? 'Login' : 'Register'}
        </Heading>
        <Stack as="form" onSubmit={handleSubmit} spacing={4}>
          {!isLogin && (
            <>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </FormControl>
            </>
          )}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  color="black" // Ensure button text is black
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {!isLogin && (
            <>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                />
              </FormControl>
            </>
          )}
          <Button type="submit" colorScheme="blue" width="full" color="black">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Text textAlign="center">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" onClick={toggleAuthMode} color="black">
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </Text>
          {isLogin && (
            <Button variant="link" onClick={() => router.push('/forgot-password')} color="black">
              Forgot Password?
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}