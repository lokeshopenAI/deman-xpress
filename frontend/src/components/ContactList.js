import React from 'react';
import ContactItem from './ContactItem';
import './ContactList.css';

const ContactList = ({ contacts, onDeleteContact, pagination, onPageChange }) => {
  if (contacts.length === 0) {
    return <div className="no-contacts">No contacts found. Add some contacts to get started!</div>;
  }

  return (
    <div className="contact-list-container">
      <h2>Contacts</h2>
      <div className="contact-list">
        {contacts.map(contact => (
          <ContactItem 
            key={contact.id} 
            contact={contact} 
            onDelete={onDeleteContact} 
          />
        ))}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactList;