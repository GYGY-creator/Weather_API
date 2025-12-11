import React, { useState, useEffect } from "react";

function AdminPanel() {
    const [users, setUsers] = useState([]);  // <-- FIX: start with empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/admin/users", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Failed to load users.");
                    return;
                }

                setUsers(data.users || []);
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [token]);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Admin Panel</h2>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table border="1" cellPadding="6">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* SAFE: users is always an array now */}
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminPanel;


