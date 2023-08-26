import { useState, useEffect } from 'react'
import './App.css'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import axios from 'axios';

function App() {
  const [emails, setEmails] = useState(0);
  const [emailsData, setEmailsData] = useState({});

  const submitHandler = event => {
    event.preventDefault();

    const data = {
      numberOfEmails: emails
    };
    axios.post('http://localhost:3001/sendEmails', data)
      .then(response => {
        setEmailsData(response.data);
        alert('Successful');
        setEmails(0);
      })
      .catch(error => {
        alert(error);
      });
  }

  useEffect(() => {
    let interval;
    if (emailsData && Object.keys(emailsData).length > 0) {
      interval = setInterval(() => {
        axios.get(`http://localhost:3001/checkStatus/${emailsData.id}`)
          .then(response => {
            setEmailsData(response.data);
          })
          .catch(error => {
            alert(error);
          });
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [emailsData]);

  return (
    <Container className='my-5'>
      <Row className='align-items-center justify-content-center'>
        <Col xs='12' md='6'>
          <div className='card-main'>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>No to emails to send</Form.Label>
                <Form.Control type="number" placeholder="No of emails to send" value={emails} onChange={e => setEmails(e.target.value)} />
              </Form.Group>
              <Button variant='success' type='submit' onClick={submitHandler} disabled={emails <= 0}>SUBMIT</Button>
            </Form>
          </div>
        </Col>
      </Row>

      {emailsData && Object.keys(emailsData).length > 0 && <Row className='align-items-center justify-content-center mt-5'>
        <Col xs='12' md='6'>
          <div className='card-main'>
            <p>{`Job id: ${emailsData.jobId}`}</p>
            <p>{`Status: ${emailsData.status}`}</p>
            <p>{`Total Emails: ${emailsData.totalEmails}`}</p>
          </div>
        </Col>
      </Row>}
    </Container>
  )
}

export default App
