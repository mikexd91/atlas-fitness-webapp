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
  { field: "name", headerName: "Name", width: 180 },
  { field: "bodyParts", headerName: "Body Part", width: 90 },
  { field: "equipment", headerName: "Equipment", width: 90 },
  {
    field: "addonEquipment",
    headerName: "AddOn",
    width: 120,
  },
  {
    field: "generalSetup",
    headerName: "General Setup",
    width: 180,
  },
  {
    field: "upperSetup",
    headerName: "Upper Setup",
    width: 150,
  },
  {
    field: "lowerSetup",
    headerName: "Lower Setup",
    width: 70,
  },
  {
    field: "execution",
    headerName: "Execution",
    width: 70,
  },
  {
    field: "progression",
    headerName: "Progression",
    width: 70,
  },
  {
    field: "caution",
    headerName: "Caution",
    width: 70,
  },
  {
    field: "strengthQuality",
    headerName: "strengthQuality",
    width: 70,
  },
  // {
  //   field: "typeOfPackage",
  //   headerName: "Package",
  //   width: 90,
  // }
];

const Exercises = () => {
  const { user, logout } = useUser();
  const [isOpen, setOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [onboardData, setOnboardData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState();

  const fetchExercises = useCallback(async (token) => {
    const response = await fetch(`${url}/exercises`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      openSnackBar(error);
    }
    let data = await response.json();
    console.log(data);
    setExercises(data.data);
  }, []);

  useEffect(async () => {
    setLoading(true);
    const token = getUserFromCookie().token;
    if (token) {
      setJwtToken(token);
      await fetchExercises(token);
    }
    setLoading(false);
  }, [fetchExercises]);

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

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    handleDrawer();
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
              Exercises
            </Typography>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              New Exercises
            </Button>
          </Stack>

          <Backdrop toggleDrawer={toggleDrawer} isOpen={isOpen}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                rowGap: "10px",
              }}
            >
              <Stack
                direction="row"
                spacing={50}
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  New Exercises
                </Typography>
                <Button onClick={toggleDrawer(false)}>
                  <MdClose size={40} />
                </Button>
              </Stack>
              {/* <Typography
                variant="h8"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                {" "}
                Select customer from existing leads data
              </Typography> */}
              {/* <ComboBox label={"Select Lead"} options={leads} handleChange={handleLeadsChange}></ComboBox>
                <Stepper steps={userData} handleChange={handleChange} submitResult={submitResult} packages={packages} leads={leads}></Stepper>

                <div>Email: {user.email}</div>
                <button onClick={() => logout()}>Logout</button> */}
            </Box>
          </Backdrop>
          <DataTable data={exercises} columns={columns} />
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Exercises);
