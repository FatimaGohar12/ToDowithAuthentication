import React, { useState } from 'react';
import { Box, Button, Stack, Text, Flex } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { auth } from './firestoreconfig';


const Sidebar = ({ children }) => {
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);
    const [showTodo, setShowTodo] = useState(false);


    const handleLogout = async () => {
        // Show a confirmation alert before logging out
        const result = await Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
        });

        if (result.isConfirmed) {
            try {
                await signOut(auth);
                navigate('/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    };


    const hideWelcomePage = () => {
        setShowWelcome(false);
        setShowTodo(false);
    };

    return (
        <Stack direction='row'>
            <Box as="nav" width="250px" height="100vh" bg="gray.800" color="white" p={4}>
                <Stack spacing={3}>
                    <Text fontSize="xl" fontWeight="bold">
                        Task World
                    </Text>

                    <Link to='/dnd'>Home</Link>
                    <Link to='/todo'>Todo</Link>

                    <Button onClick={handleLogout}>Logout</Button>
                </Stack>
            </Box>

            <Box flex="1">
                <Box>{children}</Box>
            </Box>
        </Stack>
    );
}

export default Sidebar;