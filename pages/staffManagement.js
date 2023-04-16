import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Typography,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DashBoardLayout from "../Layout/DashBoardLayout";
import AddStaff from "../Components/Staff/AddStaff";
import EditStaff from "../Components/Staff/EditStaff";
const StaffManagement = () => {
  const { register, handleSubmit, reset } = useForm();
  const [staffList, setStaffList] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  const findElementById = (array, id) => {
    return array.find((element) => element._id === id);
  };
  useEffect(() => {
    // Fetch staff list from API
    const fetchStaffList = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/manage/staff`
        );
        const data = await response.json();
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/salary`
        );
        const data = await response.json();
        setSalaryData(data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/role`
        );
        const data = await response.json();
        setRoleData(data);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchStaffList();
  }, []);

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    reset();
  };

  const handleEditDialogOpen = (id) => {
    setEditStaffId(id);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditStaffId(null);
    setIsEditDialogOpen(false);
    reset();
  };

  const handleDeleteStaff = async (id) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/manage/staff/${id}`,
        { method: "DELETE" }
      );
      setStaffList(staffList.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const onSubmitAddStaff = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/manage/staff`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const newStaff = await response.json();
      console.log(newStaff);
      setStaffList([...staffList, newStaff]);
      handleAddDialogClose();
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const onSubmitEditStaff = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/manage/staff/${editStaffId._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const updatedStaff = await response.json();
      setStaffList(
        staffList.map((staff) =>
          staff._id === updatedStaff._id ? updatedStaff : staff
        )
      );
      handleEditDialogClose();
    } catch (error) {
      console.error("Error editing staff:", error);
    }
  };
  const [addStaffDialog, setStaffDialog] = useState(false);
  const handleAddStaffDialogOpen = () => {
    setStaffDialog(true);
  };
  const handleAddStaffDialogClose = () => {
    setStaffDialog(false);
  };
  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Staff Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddStaffDialogOpen()}
      >
        Add Staff
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render staff information from API */}
            {staffList.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.IDNumber}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.gender}</TableCell>
                <TableCell>{findElementById(roleData,staff.role)?.roleName}</TableCell>
                <TableCell>
                  {findElementById(salaryData,staff.salary)?.categoryName}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    // startIcon={<EditIcon />}
                    onClick={() => handleEditDialogOpen(staff)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    // startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteStaff(staff._id)}
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

      <Dialog open={addStaffDialog} onClose={handleAddStaffDialogClose}>
        <DialogTitle>Add Staff</DialogTitle>
        <DialogContent>
          <AddStaff
            salaryData={salaryData}
            roleData={roleData}
            onClose={handleAddStaffDialogClose}
            onAdd={onSubmitAddStaff}
          ></AddStaff>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAddStaffDialogClose()} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
        <EditStaff
          onClose={handleEditDialogClose}
          onEdit={onSubmitEditStaff}
          staffData={editStaffId}
          salaryData={salaryData}
          roleData={roleData}
        />
      </Dialog>
    </Container>
  );
};

StaffManagement.layout = DashBoardLayout;

export default StaffManagement;
