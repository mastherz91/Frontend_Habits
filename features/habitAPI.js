export const fetchHabits = async (token) => {
    const response = await fetch('https://backend-habits-nine.vercel.app/habits', {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const fetchAddHabit = async ({ token, name, description, category, frequency, duration }) => {
    console.log("TOKEN QUE ENVÍAS:", token);
    const response = await fetch('https://backend-habits-nine.vercel.app/habits', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, frequency, duration }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const fetchDone = async ({ id, token }) => {
    console.log("ID QUE ENVÍAS:", id);
    const response = await fetch(`https://backend-habits-nine.vercel.app/habits/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};