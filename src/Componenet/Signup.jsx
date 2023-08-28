import React, { useState } from 'react';

// import { useHistory } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom"
import { auth } from './firestoreconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
import Swal from 'sweetalert2';

const Signup = () => {


    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSignup = async () => {
        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Password Error',
                text: 'Password should be at least 6 characters',
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User registered:', user);

            // Show a success alert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Account created successfully!',
            });


            navigate('/login');
        }



        catch (error) {
            console.error('Error registering user:', error);


            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while creating the account.',
            });


        }
    };


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Create Your Account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to Track Reccord your <Text color={'blue.400'}>Tasks</Text> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <Stack spacing={10}>
                            {/* ... other form elements ... */}
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSignup} // Call the handleSignup function on button click
                            >
                                Sign up
                            </Button>
                            <Text fontSize="sm" mt="2">
                                Have an account? <Link to="/login">Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Signup;
