import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Select, MenuItem, FormControl,InputLabel } from "@mui/material";

const AddStaff = ({ onClose, onAdd, roleData, salaryData }) => {
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = (data) => {
    onAdd(data);
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoFocus
          margin="dense"
          label="ID Number"
          fullWidth
          name="IDNumber"
          {...register("IDNumber", { required: true })}
        />
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          name="name"
          {...register("name", { required: true })}
        />
        <TextField
          margin="dense"
          label="Gender"
          fullWidth
          name="gender"
          {...register("gender", { required: true })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="role">Role</InputLabel>
          <Select
          required
            label="Role"
            name="role"
            {...register("role", { required: true })}
          >
            {roleData.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="salary">Salary</InputLabel>
          <Select
          required
            label="Salary"
            name="salary"
            {...register("salary", { required: true })}
          >
            {salaryData.map((salary) => (
              <MenuItem key={salary._id} value={salary._id}>
                {salary.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          style={{ marginTop: "20px" }}
          type="submit"
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddStaff;
