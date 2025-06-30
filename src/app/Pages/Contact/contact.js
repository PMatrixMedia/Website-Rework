import React, { useState } from 'react'; // Import useState hook
import Navbar from '../../Components/navbar';
import '../../antd.css';
import { Jumbotron, Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './style.css';
import '../../bootstrap.css';

// Functional component using hooks
const Contact = () => {
  // Use useState to manage form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Function to handle input changes
  const handleChange = (e) => {
    // Update the specific field in the formData state
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Optional: Function to handle form submission (you'd add your submission logic here)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Form submitted with data:', formData);
    // Here you would typically send the formData to an API or perform other actions
    alert('Form submitted! Check console for data.');
    // You might also clear the form after submission
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div>
      <Navbar />
      <Jumbotron fluid>
        <Container fluid>
          {/* Add onSubmit to the Form component */}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="ContactName">Name</Label>
              <Input
                type="text" // Changed type to "text" for name input
                name="name"
                id="ContactName"
                placeholder="First Last"
                onChange={handleChange}
                value={formData.name} // Control the input value with state
              />
            </FormGroup>
            <FormGroup>
              <Label for="ContactEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="ContactEmail"
                placeholder="user@address.com"
                onChange={handleChange}
                value={formData.email} // Control the input value with state
              />
            </FormGroup>
            <FormGroup>
              <Label for="ContactText">Message</Label> {/* Changed label from "Text Area" to "Message" */}
              <Input
                type="textarea"
                name="message" // Changed name from "text" to "message" for consistency with state
                id="ContactText"
                placeholder="Message Text"
                onChange={handleChange}
                value={formData.message} // Control the input value with state
              />
            </FormGroup>
            <Button type="submit">Submit</Button> {/* Added type="submit" */}
          </Form>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Contact;