import React, { useEffect } from 'react';
import { Container, Grid, Paper, Button } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from '../../assets/img1.png';
import Classes from '../../assets/img2.png';
import Teachers from '../../assets/img3.png';
import Fees from '../../assets/img4.png';
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { getAllFees } from '../../redux/feeRelated/feeHandle'; // Import the action to fetch fees
import { selectTotalFees } from '../../redux/feeRelated/feeSlice'; // Select totalFees using the selector

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);
    const totalFees = useSelector(selectTotalFees); // Get totalFees using the selector

    const adminID = currentUser?._id;

    useEffect(() => {
        if (adminID) {
        //    console.log("Fetching data for adminID:", adminID); // Check adminID
            dispatch(getAllStudents(adminID));
            dispatch(getAllSclasses(adminID, "Sclass"));
            dispatch(getAllTeachers(adminID));
            dispatch(getAllFees()); // Dispatch to fetch all fees
        }
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList?.length || 0;
    const numberOfClasses = sclassesList?.length || 0;
    const numberOfTeachers = teachersList?.length || 0;

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <Button onClick={() => handleNavigation('/Admin/students')} sx={buttonStyle}>
                            <img src={Students} alt="Students" />
                            <Title>Total Students</Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </Button>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <Button onClick={() => handleNavigation('/Admin/classes')} sx={buttonStyle}>
                            <img src={Classes} alt="Classes" />
                            <Title>Total Classes</Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </Button>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <Button onClick={() => handleNavigation('/Admin/teachers')} sx={buttonStyle}>
                            <img src={Teachers} alt="Teachers" />
                            <Title>Total Teachers</Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </Button>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <Button onClick={() => handleNavigation('/feemanagement')} sx={buttonStyle}>
                            <img src={Fees} alt="Fees" />
                            <Title>Fees Collection</Title>
                            <Data start={0} end={totalFees} duration={2.5} prefix="Rs " />
                        </Button>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
            {/* {error && <ErrorText>Error: {error}</ErrorText>} */}
        </Container>
    );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: background-color 0.3s;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: 0,
    border: 'none',
    background: 'none',
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#e0e0e0',
    },
};

export default AdminHomePage;
