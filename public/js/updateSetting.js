import { showAlert } from './alerts';

const API_URL = 'http://127.0.0.1:8000/api/v1/users';

const parseJSONResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Received non-JSON response:', text);
    throw new Error('Received non-JSON response');
  }
  return response.json();
};

// UPDATE USER DATA
export const updateUserData = async (name, email) => {
  try {
    // const token = localStorage.getItem('jwt'); // تأكد من تخزين التوكن
    const res = await fetch(`${API_URL}/updateMe`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await parseJSONResponse(res);
    console.log('Parsed Data:', data);

    if (data.status === 'Success') {
      showAlert('success', 'User updated successfully!');
      location.reload(true);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert('error', 'An error occurred. Please try again.');
  }
};

// UPDATE PASSWORD
export const updatePassword = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    const res = await fetch(`${API_URL}/UpdatePassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, password, passwordConfirm }),
    });

    const data = await parseJSONResponse(res);
    console.log('Parsed Data:', data);

    if (data.status === 'Success') {
      showAlert('success', 'Password updated successfully!');
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert('error', 'An error occurred. Please try again.');
  }
};
