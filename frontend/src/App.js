import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/contacts`);
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContactAdded = (newContact) => {
    if (currentPage === 1) {
      setContacts(prevContacts => [newContact, ...prevContacts]);
    } else {
      fetchContacts(currentPage);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${contactId}`);
      setContacts(prevContacts => 
        prevContacts.filter(contact => contact.id !== contactId)
      );
      
      if (contacts.length === 1 && currentPage > 1) {
        fetchContacts(currentPage - 1);
      } else {
        fetchContacts(currentPage);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Contact Book</h1>
        <p>Manage your contacts easily</p>
      </header>
      
      <main className="App-main">
        <ContactForm onContactAdded={handleContactAdded} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="loading">Loading contacts...</div>
        ) : (
          <ContactList 
            contacts={contacts} 
            onDeleteContact={handleDeleteContact}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
