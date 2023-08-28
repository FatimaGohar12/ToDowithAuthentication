import React, { useState } from 'react';

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firestoreconfig';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import SweetAlert from 'react-bootstrap-sweetalert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User logged in:', user);

            // Display success alert
            setAlert(
                <SweetAlert
                    success
                    title="Login Successful"
                    onConfirm={() => {
                        setAlert(null);
                        navigate('/todo');
                    }}
                >
                    Welcome back, {user.email}!
                </SweetAlert>
            );
        } catch (error) {
            console.error('Error logging in:', error);

            let errorMessage = "An error occurred during login.";

            if (error.code === "auth/user-not-found") {
                errorMessage = "Account not found. Please check your credentials.";
            }

            // Display error alert
            setAlert(
                <SweetAlert
                    error
                    title="Login Failed"
                    onConfirm={() => setAlert(null)}
                >
                    {errorMessage}
                </SweetAlert>
            );
        }
    };

    return (
        <Flex
            minH='100vh'
            align='center'
            justify='center'
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            {/* Render the alert if it's set */}
            {alert}
            <Stack spacing={8} mx='auto' maxW='lg' py={12} px={6}>
                <Stack align='center'>
                    <Heading fontSize='4xl'>Login to your account</Heading>
                    <Text fontSize='lg' color='gray.600'>
                        to enjoy all of our cool <span style={{ color: 'blue.400' }}>features</span> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                            <Text fontSize="sm" mt="2">
                                Don't have an account? <Link to="/signup">Create Account</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex >
    );
};

export default Login;
