import { useEffect, useState } from "react";

export default function AdminPanel() 
{
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("jwt");

    // Load all users
    useEffect(() => 
    {
        fetch("http://localhost:5001/admin/users", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.users) setUsers(data.users);
        });
    }, []);

    // Promote user
    function promote(id) {
        fetch(`http://localhost:5001/admin/users/${id}/promote`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + token }
        })
        .then(() => window.location.reload());
    }

    // Demote user
    function demote(id) {
        fetch(`http://localhost:5001/admin/users/${id}/demote`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + token }
        })
        .then(() => window.location.reload());
    }

    // Delete user
    function remove(id) {
        fetch(`http://localhost:5001/admin/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        })
        .then(() => window.location.reload());
    }

    return (
        <div>
            <h1>Admin Panel</h1>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <button onClick={() => promote(u.id)}>Promote</button>
                                <button onClick={() => demote(u.id)}>Demote</button>
                                <button onClick={() => remove(u.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
