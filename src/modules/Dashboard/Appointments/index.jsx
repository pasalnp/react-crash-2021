import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../Components/Title';
import * as actions from '../../../store/DashboardActions';
import EditIcon from '@material-ui/icons/Edit';
import FeedIcon from '@mui/icons-material/Feed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import ShowLoadingOrEmpty from '../../Components/ShowLoadingOrEmpty';
import axios from 'axios';
import AddCustomer from './Components/AddAppointment';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AddAppointment from './Components/AddAppointment';
const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));
export default function Appointments() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [axiosToken, setAxiosToken] = useState('');
  const [search, setSearch] = useState('');
  const subdomain = useSelector((state) => state.authReducer.user.subdomain);
  const [addOpen, setAddOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState('');
  const history = useHistory();

  const [customer, setCustomer] = useState([]);
  const [savedCustomer, setSavedCustomer] = useState([]);

  const [gridApi, setGridApi] = useState(null);

  const [gridColumnApi, setGridColumnApi] = useState(null);

  const customersList = useSelector(
    (state) => state.dashboardReducer.appointments
  );
  // console.log("subdomain",subdomain);
  useEffect(() => {
    setCustomer(customersList);
    // console.log("Customer Pageeeeeee",customersList);
    setSavedCustomer(customersList);
  }, [customersList])
  useEffect(() => {
    let newlist = savedCustomer.filter((cas) =>
      cas.fname?.toLowerCase().includes(search) || cas.contact?.toLowerCase().includes(search)
      // // console.log("creditors",cas)
    );
    // console.log(savedCustomer);
    // console.log("search...........",search);
    setCustomer(newlist);
  }, [search]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const openAddDialog = (app) => {
    setCurrentApp(app);
    // console.log("app data",app);
    setAddOpen(true);
  };
  const closeAddDialog = () => {
    setCurrentApp('');
    setAddOpen(false);
  };
  useEffect(() => {
    // const get_custumers = () => {
    //   // console.log(axiosToken);
    //   if (axiosToken) {
    //     // Cancel the previous request before making a new request
    //     axiosToken.cancel('operation canceled due to new request.');
    //   }
    //   let token = axios.CancelToken.source();
    //   setAxiosToken(token);

    // };

    // get_custumers();
    // return () => {
    //   // console.log('clear');
    //   setAxiosToken('');
    // };

    dispatch(actions.get_appointments(search, subdomain));
  }, [subdomain]);

  const onCellValueChanged = (event) => {
    // console.log('Data after change is', event.data);
  };
  const onBtnExport = () => {
    gridApi.exportDataAsCsv();
  };
  const changeSearchText = (e) => {
    setSearch(e.target.value);
  };
  const TotalValueRenderer = (props) => {
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    // console.log("props for rm",props);
    return (
      <span>
        <span>{cellValue}</span>&nbsp;
        {/* <Button variant='contained'
        color='primary' onClick={() => openAddDialog(props.data)}>Edit</Button>
        <Button variant='contained'
        color='primary' onClick={() => history.push({pathname:'/inventory/BillEdit',cas_id:props.data.cas_id})}>
        Bill
        </Button>
        <Button variant='contained'
        color='primary' onClick={() => history.push({pathname:'/main/customer/',cas_id:props.data.cas_id})}>
        View
        </Button> */}

        <Button className={classes.button} startIcon={<EditIcon />} onClick={() => openAddDialog(props.data) || <Skeleton />} />
        <Button className={classes.button} startIcon={<FeedIcon />} onClick={() => history.push({ pathname: '/inventory/BillEdit', cas_id: props.data.cas_id }) || <Skeleton />} />
        <Button className={classes.button} startIcon={<VisibilityIcon />} onClick={() => history.push({ pathname: '/main/customer/', cas_id: props.data.cas_id }) || <Skeleton />} />
      </span>
    );
  };



  return (
    <>
      <Paper id="divToPrint" className={classes.paper}>
        <div style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}>
          <Title onClick={() => onBtnExport()}>Appointments</Title>
          <TextField
            id='outlined-basic'
            label='Appointment Search'
            value={search}
            style={{ margin: 10 }}
            variant='outlined'
            fullWidth
            onChange={changeSearchText}
          />
          <Button
            variant='contained'
            color='primary'
            style={{ padding: '1px 13px' }}
            startIcon={<AddCircleIcon />}
            onClick={() => openAddDialog()}
          >
            Add Appointments
          </Button>
          <Button
            variant='contained'
            color='primary'
            style={{ marginLeft: '5px', padding: '14px 27px' }}
            startIcon={<AddCircleIcon />}
            onClick={() => onBtnExport()}
          >
            Export
          </Button>
        </div>
      </Paper>
      {customer.length > 0 ? (
        <div className="ag-theme-material" style={{
          height: '100vh',
          width: '100%'
        }}>
          <AgGridReact
            suppressExcelExport={true}
            onGridReady={onGridReady}
            rowData={customer}
            defaultColDef={{
              flex: 1,
              minWidth: 200,
              editable: false,
              resizable: true,
              sortable: true,
              floatingFilter: true,
            }}
            rowDragManaged={true}
            animateRows={true}
            frameworkComponents={{
              totalValueRenderer: TotalValueRenderer,

            }}
            rowClassRules={{
              'sick-days-warning': function (params) {
                var numSickDays = params.data.sickDays;
                return numSickDays > 5 && numSickDays <= 7;
              },
              'sick-days-breach': 'data.sickDays >= 8',
            }}
          >
            <AgGridColumn cellClicked={(parms) => alert('0')} width={80} suppressMenu={true} filter="agTextColumnFilter" headerName="#" resizable={true} field="id" sortable= {true}></AgGridColumn>
            <AgGridColumn width={150} headerName="First Name" suppressMenu={true} filter="agTextColumnFilter" resizable={true} field="patient" sortable= {true}></AgGridColumn>
            <AgGridColumn width={150} headerName="Last Name" suppressMenu={true} filter="agTextColumnFilter" resizable={true} field="uid" sortable= {true} ></AgGridColumn>
            <AgGridColumn filter="agTextColumnFilter" suppressMenu={true} width={150} headerName="Department" resizable={true} field="department" sortable= {true} ></AgGridColumn>
            <AgGridColumn width={150} headerName="State" suppressMenu={true} filter="agTextColumnFilter" resizable={true} field="state" sortable= {true} ></AgGridColumn>
            <AgGridColumn width={150} headerName="Contact" suppressMenu={true} filter="agTextColumnFilter" resizable={true} field="contact" sortable= {true} ></AgGridColumn>
            <AgGridColumn cellRenderer="totalValueRenderer" headerName="Action" ></AgGridColumn>
          </AgGridReact>
        </div>
      ) : (
        <Skeleton count={50} />
      )}
 <AddAppointment
          open={addOpen}
          handleClose={closeAddDialog}
          editStockData={currentApp}
        />
    </>
  );
}
