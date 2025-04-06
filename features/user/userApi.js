export const fetchRegisterUser = async (username, password) => {
    const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to register user');
    return json;
};

export const fetchLoginUser = async (username, password) => {
    const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to login user');
    return json;
};
