import React, {useState} from "react";

export default function user() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getUser = async () => {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUser(data);
        setLoading(false);
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1></h1>
            <button onClick={getUser}>Get User</button>
        </div>
    );
    }