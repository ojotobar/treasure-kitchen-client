import { useEffect, useState } from "react";
import { Button, Col, Row, Form, Spinner } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { FaGoogle, FaSignInAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../api/authApi";
import { toast } from "react-toastify";
import { setAuth } from "../../../auth/authSlice";

const Login = () => {
  //const userId = document.cookie.replace(/(?:(?:^|.*;\s*)profile\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const google = () => {
    window.open("http://localhost:5500/auth/google", "_self");
  }

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [login, { data: user, isLoading, isSuccess, isError, error }] = useLoginMutation();

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: ''
  })

  const { emailAddress, password } = formData;

  useEffect(() => {
    if(isError){
        toast.error(error?.data?.message)
    }

    if(isSuccess || user){
        toast.success("Login successful");
        dispatch(setAuth(user))
        navigate(-1);
    }
}, [user, isError, isSuccess, error, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const [validated, setValidated] = useState(false);
  
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    e.preventDefault();
    await login(formData)
  };
  return (
    <Container style={{position: 'relative'}} fluid>
      <Row className="App" style={{backgroundImage: 'url(https://res.cloudinary.com/otrprojs/image/upload/v1687569662/page-common-bg_jiy1g2.jpg)'}}>
        <Row className="color-overlay d-flex justify-content-center align-items-center">
          <h1 className="AppHeading text-center">Login</h1>
        </Row>
      </Row>
      <Row className="m-0 p-0" style={{position: 'absolute', top: '70%', left: '0', right: '0'}}>
        <Col xs={0} sm={1} md={2} lg={3} className="m-0 p-0"></Col>
        <Col xs={12} sm={10} md={8} lg={6} className="d-flex justify-content-center align-items-center">
          <Card
              bg='light'
              className="m-1 w-100 BoxShadow"
              style={{minHeight: '30vh'}}
            >
              <Card.Body className="d-flex justify-content-center flex-column align-items-center">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col lg={12} className='mb-2 py-2'>
                        <Form.Group>
                            <Form.Control 
                                className="p-2"
                                type="emailAddress"
                                autoComplete="off"
                                required      
                                id="emailAddress"
                                name="emailAddress"
                                value={emailAddress}
                                onChange={onChange}
                                placeholder="example@email.com"/>
                                <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col lg={12} className='mb-2 py-2'>
                        <Form.Group>
                            <Form.Control 
                                className="p-2"
                                type="password"   
                                id="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                placeholder="Password"/>
                                <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col lg={12} className="mb-3">
                      <span>No account? <Link to='/register'>Sign up</Link></span><br/>
                      <span><Link to='/reset-password'>Forgot password?</Link></span>
                    </Col>
                    <Col lg={12} className="d-flex justify-content-center align-items-center">
                      { isLoading ? 
                          <Button type="submit" className='loginButton noOutline p-1' style={{background: '#583010'}}><Spinner /></Button> :
                          <Button type="submit" className='loginButton p-2 noOutline' style={{background: '#583010'}}><FaSignInAlt/> Sign In</Button>
                      }
                    </Col>
                  </Row>
                </Form>
                <Card.Text className="google loginButton text-center p-2" onClick={google}><FaGoogle /> Google</Card.Text>
              </Card.Body>
            </Card>
        </Col>
        <Col xs={0} sm={1} md={2} lg={3} className="m-0 p-0"></Col>
      </Row>
    </Container>
  )
}

export default Login