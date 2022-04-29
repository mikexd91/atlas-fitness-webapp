import { useCallback, useEffect, useState } from "react";
import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import { getUserFromCookie } from "../auth/userCookie";
import Drawer from "../components/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DataTable from "../components/DataTable";
import Backdrop from "../components/Backdrop";
import Stepper from "../components/Stepper";
import ComboBox from "../components/ComboBox";
import Progress from "../components/Progress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MdClose } from "react-icons/md";
import Snackbar from "../components/Snackbar";
import { url } from "../urlConfig";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "firstName", headerName: "First Name", width: 90 },
  { field: "lastName", headerName: "Last Name", width: 90 },
  { field: "enquiredDate", headerName: "Enquired On", width: 90 },
  {
    field: "appointmentDate",
    headerName: "Consultation Date",
    width: 90,
  },
  {
    field: "phone",
    headerName: "Contact No.",
    width: 90,
  },
  {
    field: "goal",
    headerName: "Goal",
    width: 90,
  },
];

const Leads = () => {
  const { user, logout } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [onboardData, setOnboardData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();

  const fetchLeads = useCallback(async (token) => {
    const response = await fetch(`${url}/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let leads = await response.json();
    console.log(leads);
    setLeads(leads.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie().token;
    if (token) {
      setJwtToken(token);
      await fetchLeads(token);
    }
    setLoading(false);
  }, [fetchLeads]);

  const openSnackBar = (result) => {
    console.log(result);
    if (result.status && result.status === "success") {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(result.message || result.error?.message);
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleDrawer = () => {
    userData.map((item) => {
      item.questions.map((item2) => {
        delete item2.answer;
        delete item2.defaultValue;
      });
    });
    setUserData([...userData]);
    setOpen(!isOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div>
      <Snackbar
        handleClose={handleClose}
        message={snackbarMessage}
        open={isSnackbarOpen}
        severity={snackbarSeverity}
      />
      <Progress open={loading} />
      {user?.email && (
        <Drawer>
          <Stack
            direction="row"
            spacing={20}
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", paddingBottom: "20px" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
              }}
            >
              Leads
            </Typography>
          </Stack>
          <DataTable data={leads} columns={columns} />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Leads);
