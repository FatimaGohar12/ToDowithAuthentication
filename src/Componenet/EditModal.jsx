// EditModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firestoreconfig';
import Swal from 'sweetalert2'; // Import SweetAlert2

const EditModal = ({ isOpen, onClose, selectedTodo }) => {
    const [updatedTask, setUpdatedTask] = useState('');

    useEffect(() => {
        // Set the updated task value from selectedTodo
        if (selectedTodo) {
            setUpdatedTask(selectedTodo.text);
        }
    }, [selectedTodo]);

    const handleInputChange = (e) => {
        setUpdatedTask(e.target.value);
    };

    const handleSave = async () => {
        if (!selectedTodo) return;

        try {
            const todoRef = doc(db, 'todos', selectedTodo.id);
            await updateDoc(todoRef, { text: updatedTask });

            // Show a success alert using SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Task updated successfully!',
            });

            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating ToDo: ", error);
            // Handle error if the update fails
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit ToDo</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Updated Task</FormLabel>
                        <Input placeholder='Updated task' value={updatedTask} onChange={handleInputChange} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSave}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditModal;
