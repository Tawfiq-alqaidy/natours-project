import { showAlert } from './alerts';

const parseJSONResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Received non-JSON response:', text);
    throw new Error('Received non-JSON response');
  }
  return response.json();
};

export const login = async (email, password) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJSONResponse(res);
    console.log('Parsed Data:', data);

    if (data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert('error', 'An error occurred. Please try again.');
  }
};

export const logout = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/users/logout', {
      method: 'GET',
    });

    const data = await parseJSONResponse(res);
    console.log('Parsed Data:', data);

    if (data.status === 'Success') {
      showAlert('success', 'Logged out successfully!');
      location.reload(true);
    } else {
      showAlert('error', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('error', 'Error logging out! Please try again.');
  }
};
