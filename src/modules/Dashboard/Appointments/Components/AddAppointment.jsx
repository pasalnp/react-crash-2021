import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Title from '../../../Components/Title';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../store/DashboardActions';
import StockAppRules from './StockAppRules';
import { ValidateForm, ValidateInput } from '../../../../../utils/validateForm';


const AddAppointment = ({ open, handleClose, editStockData,customerFullName}) => {
  const vendorList = useSelector((state) => state.dashboardReducer.vendors);
  const subdomain = useSelector((state) => state.authReducer.user.subdomain);
  const dispatch = useDispatch();
  
  
  const [search, setSearch] = useState();
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // console.log("OPENING2",customerFullName)
  const initialData = {
    fname: customerFullName||'',
    address:'',
    age:'',
    contact:'',
    subdomain,
    search,
  };
  const [stockData, setStockData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const onChangeHandler = (e) => {
    setSearch(e.target.value);
    setStockData({
      ...stockData,
      [e.target.name]: capitalizeFirstLetter(e.target.value),
    });
  };
  
  // useEffect(() => {
  //   if (vendorList.length === 0) {
  //     dispatch(actions.get_vendors());
  //   }
  // }, [vendorList, dispatch]);
  
  // useEffect(() => {
  //   setErrors(initialData);
  //   setStockData(initialData);
  // },[])
  useEffect(() => {
    dispatch(actions.get_customers(initialData));
    // console.log("get_customer",initialData);
  },[search,stockData,dispatch]);
  
  useEffect(() => {
    // console.log(editStockData);
    if (editStockData) {
      setStockData(editStockData);
    } else {
      setStockData(initialData);
    }
  }, [editStockData]);
  
  const inputValidation = (e) => {
    let errorMsg = ValidateInput(e.target.name, e.target.value, StockAppRules);
    setErrors({
      ...errors,
      [e.target.name]: errorMsg,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorMsgs = ValidateForm(stockData, StockAppRules);
    setErrors({ ...errorMsgs });
    let validated = Object.values(errorMsgs).join('').length === 0;
    if (validated) {
      dispatch(actions.add_customer(stockData));
      handleClose();
    }
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    // console.log(stockData);
    let errorMsgs = ValidateForm(stockData, StockAppRules);
    setErrors({ ...errorMsgs });
    let validated = Object.values(errorMsgs).join('').length === 0;
    if (validated) {
      dispatch(actions.update_customer(stockData));
      handleClose();
    }
  };
  return (
    <Dialog
    open={open}
    fullScreen={false}
    onClose={handleClose}
    aria-labelledby='responsive-dialog-title'
    >
    <DialogTitle id='responsive-dialog-title'>
    <Title>Create Appointment</Title>
    </DialogTitle>
    <DialogContent dividers>
    <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>
    {/* <Grid item xs={10}>
    <FormControl fullWidth error={errors.vendor_id}>
    <InputLabel shrink>Vendor</InputLabel>
    <Select
    onBlur={inputValidation}
    displayEmpty
    name='vendor_id'
    value={stockData.vendor_id}
    onChange={onChangeHandler}
    >
    {vendorList.map((vendor) => (
      <MenuItem value={vendor.vendor_id}>
      {vendor.meta_title}
      </MenuItem>
      ))}
      </Select>
      <FormHelperText>{errors.vendor_id}</FormHelperText>
      </FormControl>
    </Grid> */}
    {/* <Grid item xs={2}>
    <Button>Add</Button>
  </Grid> */}
  <Grid item xs={6}>
  <TextField
  margin='dense'
  name='fname'
  value={stockData.fname}
  error={errors.fname}
  helperText={errors.fname}
  label='FullName'
  onChange={onChangeHandler}
  onBlur={inputValidation}
  type='text'
  fullWidth
  />
  </Grid>
  <Grid item xs={6}>
  <TextField
  margin='dense'
  name='address'
  value={stockData.address}
  error={errors.address}
  helperText={errors.address}
  label='Fulladdress'
  onChange={onChangeHandler}
  onBlur={inputValidation}
  type='text'
  fullWidth
  />
  </Grid>
  <Grid item xs={6}>
  <TextField
  disabled={true}
  margin='dense'
  id='name'
  name='subdomain'
  value={stockData.subdomain}
  onChange={onChangeHandler}
  onBlur={inputValidation}
  label='Subdomain'
  type='text'
  error={errors.subdomain}
  helperText={errors.subdomain}
  fullWidth
  />
  </Grid>
  <Grid item xs={6}>
  <TextField
  margin='dense'
  id='contact'
  name='contact'
  value={stockData.contact}
  error={errors.contact}
  helperText={errors.contact}
  onChange={onChangeHandler}
  onBlur={inputValidation}
  label='Contact No'
  type='text'
  fullWidth
  />
  </Grid>
  <Grid item xs={6}>
  <TextField
  margin='dense'
  id='age'
  name='age'
  value={stockData.age}
  error={errors.age}
  helperText={errors.age}
  onChange={onChangeHandler}
  onBlur={inputValidation}
  label='Age'
  type='text'
  fullWidth
  />
  </Grid>
  <Grid item xs={6}>
  <TextField
  margin='dense'
  name='lname'
  value={stockData.lname}
  error={errors.lname}
  helperText={errors.lname}
  onChange={onChangeHandler}
  onBlur={inputValidation}
  label='Nick Name'
  type='text'
  fullWidth
  />
  </Grid>
  {/* <Grid item xs={6}>
  <TextField
  margin='dense'
  label='End Date'
  value={stockData.valid_till}
  name='valid_till'
  error={errors.valid_till}
  helperText={errors.valid_till}
  onChange={onChangeHandler}
  onBlur={inputValidation}
  type='date'
  fullWidth
  InputLabelProps={{
    shrink: true,
  }}
  />
</Grid> */}
</Grid>
</form>
</DialogContent>
<DialogActions>
<Button color='primary' onClick={handleClose}>
Cancel
</Button>
{editStockData ? (
  <Button variant='contained' color='primary' onClick={handleUpdate}>
  Update
  </Button>
  ) : (
    <Button variant='contained' color='primary' onClick={handleSubmit}>
    Create
    </Button>
    )}
    </DialogActions>
    </Dialog>
    );
  };
  
  export default AddAppointment;
  