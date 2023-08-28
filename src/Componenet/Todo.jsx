import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Flex, Box, Input, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Checkbox, Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import Swal from 'sweetalert2';
import { db } from './firestoreconfig';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, where, query } from 'firebase/firestore';
import EditModal from "./EditModal";
import { useStrictDroppable } from './useStrictDroppable';


const Todo = ({ user, loading }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [currentViewedTodo, setCurrentViewedTodo] = useState(null);
    const [newTodo, setNewTodo] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [enabled] = useStrictDroppable(loading);


    //for edit 
    const [editedText, setEditedText] = useState('');

    const fetchTodos = async () => {

        const q = query(collection(db, "todos"), where("created_by", "==", user.uid));

        // const todosCollection = collection(db, 'todos');
        const todosSnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        //   });
        const todosData = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(todosData)
        setTodos(todosData);
    };

    useEffect(() => {
        fetchTodos();
    }, [user.uid]);

    const handleAddTodo = async () => {
        if (newTodo.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Todo',
                text: 'Please enter a valid todo before adding.',
            });
            return;
        }

        try {
            const todoRef = await addDoc(collection(db, "todos"), { text: newTodo, completed: false, created_by: user.uid });
            console.log("ToDo added with ID: ", todoRef.id);
            setNewTodo('');
            Swal.fire({
                icon: 'success',
                title: 'Todo Added',
                text: 'Your todo has been added successfully!',
            });
            await fetchTodos(); // Wait for fetchTodos to complete
            // ... navigate or reload here
        } catch (error) {
            console.error("Error adding ToDo: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the todo.',
            });
        }
    };


    const deleteTodo = async (todo) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                const todoRef = doc(db, 'todos', todo.id);
                await deleteDoc(todoRef);
                setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todo.id));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Task deleted successfully!',
                });
            } catch (error) {
                console.error("Error deleting ToDo: ", error);
            }
        }
    };

    const handleCheckboxChange = async (todo) => {
        try {
            const todoRef = doc(db, 'todos', todo.id);
            await updateDoc(todoRef, { completed: !todo.completed });

            // Update the state after the Firestore update is successful
            const updatedTodos = todos.map((t) =>
                t.id === todo.id ? { ...t, completed: !t.completed } : t
            );
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error updating ToDo completion status: ", error);
            // Handle error if the Firestore update fails
        }
    };



    const handleFilter = () => {
        if (filterType === 'Completed') {
            return todos.filter(todo => todo.completed);
        } else if (filterType === 'Not Completed') {
            return todos.filter(todo => !todo.completed);
        }
        // Return all todos if filterType is 'All' or null
        return todos;
    };

    // const editTodo = (todo) => {
    //     setSelectedTodo(todo);
    // };



    const editTodo = (todo) => {
        setSelectedTodo(todo);
        setEditedText(todo.text); // Set the initial value for the edited text
        onOpen();
    };


    const setViewedTodo = (todo) => {
        setCurrentViewedTodo(todo);
        onOpen();
    };
    const handleDragEnd = (result) => {
        if (!result.destination) return; // No change in position

        const reorderedTodos = [...todos];
        const [reorderedTodo] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, reorderedTodo);

        setTodos(reorderedTodos);
    };


    return (
        <Flex justifyContent="center" alignItems="center" minHeight="40vh" bg="gray.100" marginTop="40px">
            <Flex direction="column" width="900px" p="4" bg="white" boxShadow="md" borderRadius="md" >
                <Flex alignItems="center">
                    <Input
                        placeholder="Add ToDo"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        width="100%"
                    />
                    <Button colorScheme="teal" ml="3" onClick={handleAddTodo}>
                        Add
                    </Button>
                </Flex>
                <Flex alignItems="center" marginTop="10px" >
                    <Menu>
                        <MenuButton as={Button} colorScheme="blue" width="100%">
                            {filterType ? filterType : 'All'}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => setFilterType('All')}>All</MenuItem>
                            <MenuItem onClick={() => setFilterType('Completed')}>Completed</MenuItem>
                            <MenuItem onClick={() => setFilterType('Not Completed')}>Not Completed</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {enabled &&
                        <Droppable droppableId="todo">
                            {(provided) => (
                                <Flex
                                    direction="column"
                                    width="600px"
                                    mt="4"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {handleFilter().map((todo, index) => (
                                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                            {(provided) => (



                                                <Box key={todo.id} p="4" bg="white" boxShadow="md" borderRadius="md" borderWidth="1px" mt="2" width="864px" ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps} >
                                                    <Flex justifyContent="space-between" alignItems="center">
                                                        <Checkbox
                                                            isChecked={todo.completed}
                                                            onChange={() => handleCheckboxChange(todo)}
                                                        >
                                                            <Text textDecoration={todo.completed ? 'line-through' : 'none'}>{todo.text}</Text>
                                                        </Checkbox>
                                                        <Flex gap="2">
                                                            <Button colorScheme="blue" onClick={() => editTodo(todo)}>Edit</Button>
                                                            <Button colorScheme="red" onClick={() => deleteTodo(todo)}>Delete</Button>
                                                            <Button colorScheme="green" onClick={() => setViewedTodo(todo)}>View</Button>
                                                        </Flex>
                                                    </Flex>
                                                </Box>

                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Flex>
                            )}
                        </Droppable>
                    }
                </DragDropContext>

            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ToDo Title</ModalHeader>
                    <ModalCloseButton />
                    {currentViewedTodo && (
                        <ModalBody>
                            <Text fontWeight='bold' mb='1rem'>{currentViewedTodo.text}</Text>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <EditModal isOpen={!!selectedTodo} onClose={() => setSelectedTodo(null)} selectedTodo={selectedTodo} />
        </Flex>
    )
}

export default Todo;
