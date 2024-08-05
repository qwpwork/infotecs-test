import { useEffect, useState } from 'react';

import { 
  Container, Box, styled,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText
} from '@mui/material';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';

export default function App() {
  
  /*
    * States init
  */

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  //set columns info (headernames and content)
  const columns = [
    {
      field: 'fullName',
      headerName: 'Name',
      width: 100,
      minWidth: 50,
      valueGetter: (value, users) => `${users.firstName + " " + users.lastName}`
    },
    {
      field: 'age',
      headerName: 'Age',
      minWidth: 50
    },
    {
      field: 'gender',
      headerName: 'Gender',
      minWidth: 50
    },
    {
      field: 'phone',
      headerName: 'Phone number',
      minWidth: 50,
      sortable: false
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 100,
      minWidth: 50,
      valueGetter: (value, users) => `${users.address.city + ", " + users.address.address}`
    }
  ];

  /*
    * Methods
  */

  //IIFE for get the json data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await fetch("https://dummyjson.com/users");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  //Change the height of searchbar
  const StyledSearch = styled(GridToolbarQuickFilter)(({ theme }) => ({
    height: '50px',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  }));

  //Modal window toggle
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*
    @params contains the info (Object) about clicked row in table
    * This method is calling when we clicking on table rows
  */
  const setDialogUp = (params) => {
    handleOpen();
    //params.row contains necessary information
    const data = params.row

    setUserInfo([
      {id: 0, label: "Name: ", value: data.firstName + " " + data.lastName},
      {id: 1, label: "Age: ", value: data.age},
      {id: 2, label: "Address: ", value: data.address.city + ", " + data.address.address},
      {id: 3, label: "Height: ", value: data.height},
      {id: 4, label: "Weight: ", value: data.weight},
      {id: 5, label: "Phone: ", value: data.phone},
      {id: 6, label: "E-mail", value: data.email}
    ])
  };

  /*
    * Components
  */

  //Modal window
  const UserInfo = (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>User data:</DialogTitle>
      <DialogContent>
        <List>
          {userInfo.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.label} secondary={item.value}/>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )

  //Table with users info
  const UsersData = (
    <Container>
      <DataGrid
        rows={users}
        columns={columns}
        disableColumnMenu
        slots={{toolbar: StyledSearch}}
        onRowClick={setDialogUp}
      />
    </Container>
  )

  //Render
  return (
    <Box display="flex" alignItems="center" minWidth="250px" width="100vw">
      {UserInfo}
      {UsersData}
    </Box>
  )
}