import React, {useState} from 'react';

const Register = () =>{
    return (
        <>
            <StudentRegister />
        </>
    )
}

const StudentRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Registration successful:', data);
    })
    .catch((error) => {
        console.error('Error during registration:', error);
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
    }

    return (
        <div>
            <h3>Student Registration Form</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Register</button>

            </form>
        </div>
    )
}

export default Register;