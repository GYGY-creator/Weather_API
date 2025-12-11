// controllers/adminController.js

const UserModel = require("../models/user");

// Return all users (visible to admin or superadmin)
async function ListUsers(req, res)
{
    try
    {
        const users = await UserModel.GetAll();
        return res.json({ users: users });
    }
    catch (error)
    {
        console.error("Error in ListUsers:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// Return a single user by ID
async function GetUser(req, res)
{
    try
    {
        const id = req.params.id;
        const user = await UserModel.Get(id);

        if (!user)
        {
            return res.status(404).json({ error: "User not found." });
        }

        return res.json(user);
    }
    catch (error)
    {
        console.error("Error in GetUser:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// Update user data EXCEPT role.
async function UpdateUser(req, res)
{
    try
    {
        const id = req.params.id;
        const updates = req.body;

        // Prevent updating role through this route
        if (updates.role) 
        {
            delete updates.role;
        }

        const updated = await UserModel.Update(id, updates);

        if (!updated)
        {
            return res.status(404).json({ error: "User not found." });
        }

        return res.json({
            message: "User updated successfully.",
            user: updated
        });
    }
    catch (error)
    {
        console.error("Error in UpdateUser:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// Allow admin/superadmin to delete users.
async function DeleteUser(req, res)
{
    try
    {
        const id = req.params.id;

        const success = await UserModel.Delete(id);

        if (!success)
        {
            return res.status(404).json({ error: "User not found." });
        }

        return res.json({
            message: "User deleted successfully."
        });
    }
    catch (error)
    {
        console.error("Error in DeleteUser:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// Change user role from 'user' → 'admin'.
async function PromoteUserToAdmin(req, res)
{
    try
    {
        const id = req.params.id;

        const updated = await UserModel.Update(id, { role: "admin" });

        if (!updated)
        {
            return res.status(404).json({ error: "User not found." });
        }

        return res.json({
            message: "User promoted to admin.",
            user: updated
        });
    }
    catch (error)
    {
        console.error("Error in PromoteUser:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// Change user role from 'admin' → 'user'.
async function DemoteAdminToUser(req, res)
{
    try
    {
        const id = req.params.id;

        const updated = await UserModel.Update(id, { role: "user" });

        if (!updated)
        {
            return res.status(404).json({ error: "User not found." });
        }

        return res.json({
            message: "Admin demoted to user.",
            user: updated
        });
    }
    catch (error)
    {
        console.error("Error in DemoteUser:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

module.exports =
{
    ListUsers,
    GetUser,
    UpdateUser,
    DeleteUser,
    PromoteUserToAdmin,
    DemoteAdminToUser
};

