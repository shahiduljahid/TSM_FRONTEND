import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DashBoardLayout from "../Layout/DashBoardLayout";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import axios from "axios";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles from API on component mount
  useEffect(() => {
    // Fetch staff list from API
    const fetchStaffList = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/role`
        );
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };
    fetchStaffList();
  }, []);

  // Handle role selection for edit
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  // Handle closing of dialog
  const handleDialogClose = () => {
    setSelectedRole(null);
    setDialogOpen(false);
  };

  // Handle role update
  const handleRoleUpdate = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${selectedRole._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const updatedRole = await response.json();
      setRoles(
        roles.map((role) => (role._id === updatedRole._id ? updatedRole : role))
      );
      handleDialogClose();
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  //handle Add Role

  const handleAddRole = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/role`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const newRole = await response.json();
      console.log(newRole);
      setRoles([...roles, newRole]);
      handleDialogClose();
    } catch (error) {
      console.error("Error adding Role:", error);
    }
  };
  //handle Delete
  const handleDeleteRole = async (id) => {
    try {
      console.log(id);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/role/${id}`
      );
      console.log(res.data);
      setRoles(roles.filter((role) => role._id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div>
      {/* Button to open the role form dialog */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Add Role
      </Button>

      {/* Role list component */}
      <RoleList
        roles={roles}
        onEditRole={handleEditRole}
        handleDeleteRole={handleDeleteRole}
      />

      {/* Role form dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <RoleForm handleAddRole={handleAddRole} onClose={handleDialogClose} />
      </Dialog>

      {/* Role edit form dialog */}
      <Dialog open={selectedRole !== null} onClose={handleDialogClose}>
        <RoleEditForm role={selectedRole} onUpdateRole={handleRoleUpdate} />
      </Dialog>
    </div>
  );
};
RoleManagement.layout = DashBoardLayout;
export default RoleManagement;
const RoleList = ({ roles, onEditRole, handleDeleteRole }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            {/* Add more columns as needed */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.roleCode}>
              <TableCell>{role.roleCode}</TableCell>
              <TableCell>{role.roleName}</TableCell>
              {/* Add more cells as needed */}
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => onEditRole(role)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  // startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteRole(role._id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RoleForm = ({ onClose, handleAddRole }) => {
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleName, setRoleName] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { roleCode, roleName, roleDescription };
    handleAddRole(data);
    onClose();
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Role ID"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Role Description"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Add more form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Add Role
        </Button>
      </form>
    </div>
  );
};
const RoleEditForm = ({ role, onUpdateRole }) => {
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleName, setRoleName] = useState("");

  // Update local state with role data on component mount
  useEffect(() => {
    if (role) {
      setRoleName(role.roleName);
      setRoleCode(role.roleCode);
      setRoleDescription(role.roleDescription);
      // Update more state with other role data as needed
    }
  }, [role]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submit logic here, e.g. send updated role data to API
    const data = { roleCode, roleName, roleDescription };
    onUpdateRole(data);
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Role ID"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Role Description"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Add more form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Update Role
        </Button>
      </form>
    </div>
  );
};
