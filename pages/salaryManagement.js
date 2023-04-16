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

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // Fetch Salarys from API on component mount
  useEffect(() => {
    // Fetch staff list from API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/salary`
        );
        const data = await response.json();
        setSalaries(data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    };
    fetchData();
  }, []);

  // Handle Salary selection for edit
  const handleEditData = (ele) => {
    setSelectedElement(ele);
    setDialogOpen(true);
  };

  // Handle closing of dialog
  const handleDialogClose = () => {
    setSelectedElement(null);
    setDialogOpen(false);
  };

  // Handle Salary update
  const handleDataUpdate = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/salary/${selectedElement._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const updatedData = await response.json();
      setSalaries(
        salaries.map((ele) =>
          ele._id === updatedData._id ? updatedData : ele
        )
      );
      handleDialogClose();
    } catch (error) {
      console.error("Error editing Salary:", error);
    }
  };

  //handle Add Salary

  const handleAddData = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/salary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const newData = await response.json();
      console.log(newData);
      setSalaries([...salaries, newData]);
      handleDialogClose();
    } catch (error) {
      console.error("Error adding Salary:", error);
    }
  };
  //handle Delete
  const handleDeleteData = async (id) => {
    try {
      console.log(id);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/salary/${id}`
      );
      console.log(res.data);
      setSalaries(salaries.filter((ele) => ele._id !== id));
    } catch (error) {
      console.error("Error deleting Data:", error);
    }
  };

  return (
    <div>
      {/* Button to open the Salary form dialog */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Add Salary Element
      </Button>

      {/* Salary list component */}
      <SalaryList
        salaries={salaries}
        handleEditData={handleEditData}
        handleDeleteData={handleDeleteData}
      />

      {/* Salary form dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <SalaryForm handleAddData={handleAddData} onClose={handleDialogClose} />
      </Dialog>

      {/* Salary edit form dialog */}
      <Dialog open={selectedElement !== null} onClose={handleDialogClose}>
        <SalaryEditForm
          selectedElement={selectedElement}
          handleDataUpdate={handleDataUpdate}
        />
      </Dialog>
    </div>
  );
};
SalaryManagement.layout = DashBoardLayout;
export default SalaryManagement;
const SalaryList = ({ salaries, handleEditData, handleDeleteData }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category Name</TableCell>
            <TableCell>Salary Amount</TableCell>
            {/* Add more columns as needed */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salaries.map((ele) => (
            <TableRow key={ele._id}>
              <TableCell>{ele.categoryName}</TableCell>
              <TableCell>{ele.salaryAmount}</TableCell>
              {/* Add more cells as needed */}
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditData(ele)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  // startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteData(ele._id)}
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

const SalaryForm = ({ onClose, handleAddData }) => {
  const [categoryName, setCategoryName] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { categoryName, salaryAmount };
    handleAddData(data);
    onClose();
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Salary Amount"
          type="number"
          value={salaryAmount}
          onChange={(e) => setSalaryAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Add more form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Add Salary Element
        </Button>
      </form>
    </div>
  );
};
const SalaryEditForm = ({ selectedElement, handleDataUpdate }) => {
  const [categoryName, setCategoryName] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  // Update local state with Salary data on component mount
  useEffect(() => {
    if (selectedElement) {
      setCategoryName(selectedElement.categoryName);
      setSalaryAmount(selectedElement.salaryAmount);
      // Update more state with other Salary data as needed
    }
  }, [selectedElement]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submit logic here, e.g. send updated Salary data to API
    const data = { categoryName, salaryAmount };
    handleDataUpdate(data);
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Salary Amount"
          type="number"
          value={salaryAmount}
          onChange={(e) => setSalaryAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Add more form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Update Salary Element
        </Button>
      </form>
    </div>
  );
};
