import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, isSameDay, parse } from 'date-fns';
import { getAllFees, createFee, updateFee } from '../redux/feeRelated/feeHandle'; 
import {
    Container,
    Grid,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const FeeManagement = () => {
    const dispatch = useDispatch();
    const { feeData = [], loading, totalFees } = useSelector((state) => state.fees || {});

    const [newFee, setNewFee] = useState({
        name: '',
        rollNumber: '',
        amount: '',
        class: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [classSearchTerm, setClassSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(''); 
    const [filteredFees, setFilteredFees] = useState(feeData);
    const [showFilters, setShowFilters] = useState(false); 

    useEffect(() => {
        dispatch(getAllFees());
    }, [dispatch]);

    useEffect(() => {
        filterFees(); 
    }, [feeData]);

    useEffect(() => {
        filterFees(); 
    }, [searchTerm, classSearchTerm, dateFilter]);

    const handleFeeChange = (e) => {
        setNewFee({ ...newFee, [e.target.name]: e.target.value });
    };

    const handleAddFee = () => {
        dispatch(createFee(newFee));
        setNewFee({ name: '', rollNumber: '', amount: '', class: '' });
    };

    const handleEditFee = (payment) => {
        setNewFee({
            name: payment.name,
            rollNumber: payment.rollNumber,
            amount: payment.amount,
            class: payment.class,
            id: payment._id,
        });
    };

    const handleUpdateFee = () => {
        dispatch(updateFee(newFee));
        setNewFee({ name: '', rollNumber: '', amount: '', class: '' });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClassSearchChange = (e) => {
        setClassSearchTerm(e.target.value);
    };

    const handleDateFilterChange = (e) => {
        setDateFilter(e.target.value); 
    };

    const toggleFilters = () => {
        setShowFilters((prev) => !prev); 
    };

    const filterFees = () => {
        const filtered = feeData.filter(fee => {
            const matchesName = fee.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = fee.class.toLowerCase().includes(classSearchTerm.toLowerCase());
            const matchesDate = dateFilter ? isSameDay(new Date(fee.date), parse(dateFilter, 'dd/MM/yyyy', new Date())) : true;

            return matchesName && matchesClass && matchesDate;
        });
        setFilteredFees(filtered);
    };

    // Function to print payment slip
    const printPaymentSlip = (payment) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Fee Payment Slip</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f7f7f7; }
                    .container { width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffe0; border: 1px solid #ccc; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
                    .receipt-header { text-align: center; }
                    .receipt-header h2 { margin: 0; font-size: 22px; font-weight: bold; color: #000; }
                    .receipt-header p { margin: 2px 0; font-size: 14px; color: #333; }
                    .receipt-header h3 { margin: 10px 0; font-size: 18px; }
                    .student-info p { font-size: 14px; margin: 8px 0; }
                    .student-info span { font-weight: bold; padding-left: 10px; }
                    table { width: 100%; margin-top: 10px; border-collapse: collapse; }
                    table, th, td { border: 1px solid #000; }
                    th, td { padding: 10px; text-align: left; font-size: 14px; }
                    .total-label { text-align: right; font-weight: bold; }
                    .payment-info { margin-top: 15px; }
                    .payment-info p { font-size: 14px; margin: 8px 0; }
                    .payment-info span { font-weight: bold; }
                    .footer { margin-top: 20px; text-align: center; font-size: 12px; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="receipt-header">
                        <h2>SAHASRA HIGH SCHOOL</h2>
                        <p>Near Kamepalli(Village), Zarugumalli(Man), Prakasma(Dist)</p>
                        <p>Contact: xxxxxxxxx | Email: xxxxx@gmail.com</p>
                        <h3>Receipt No. <span>${payment._id}</span></h3>
                    </div>
                    <div class="student-info">
                        <p>Name of Student: <span>${payment.name}</span></p>
                        <p>Class: <span>${payment.class}</span></p>
                        <p>Roll Number: <span>${payment.rollNumber}</span></p>
                        <p>Date of Payment: <span>${format(new Date(), 'dd/MM/yyyy')}</span></p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Particulars</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Admission<br>Tuition<br>Exam</td>
                                <td>Rs ${payment.amount}</td>
                            </tr>
                            <tr>
                                <td colspan="2" class="total-label">Total</td>
                                <td>Rs ${payment.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="payment-info">
                        <p>Signature of Centre Head: <span>_________________</span></p>
                    </div>
                    <div class="footer">
                        <p>All above mentioned Amount once paid are non-refundable in any case whatsoever.</p>
                    </div>
                </div>
                <script>
                    window.print();
                    window.onafterprint = function() { window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <Container>
            <Typography variant="h2">Fee Management</Typography>
            {loading && <p>Loading...</p>}

            <Typography variant="h5">Total Fees Collected: Rs {totalFees}</Typography>

            <Button variant="contained" onClick={toggleFilters}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {showFilters && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <TextField
                            label="Search by Name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Search by Class"
                            value={classSearchTerm}
                            onChange={handleClassSearchChange}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Filter by Date (dd/mm/yyyy)"
                            value={dateFilter}
                            onChange={handleDateFilterChange}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h3>{newFee.id ? 'Edit Fee' : 'Add New Fee'}</h3>
                    <TextField
                        name="name"
                        label="Student Name"
                        value={newFee.name}
                        onChange={handleFeeChange}
                        sx={{ mr: 1 }}
                    />
                    <TextField
                        name="rollNumber"
                        label="Roll Number"
                        value={newFee.rollNumber}
                        onChange={handleFeeChange}
                        sx={{ mr: 1 }}
                    />
                    <TextField
                        name="amount"
                        label="Amount"
                        type="number"
                        value={newFee.amount}
                        onChange={handleFeeChange}
                        sx={{ mr: 1 }}
                    />
                    <TextField
                        name="class"
                        label="Class"
                        value={newFee.class}
                        onChange={handleFeeChange}
                        sx={{ mr: 1 }}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={newFee.id ? handleUpdateFee : handleAddFee}
                    >
                        {newFee.id ? 'Make Change' : 'Add Fee'}
                    </Button>
                </Grid>
            </Grid>

            <PaymentsTable payments={filteredFees} onEdit={handleEditFee} onPrint={printPaymentSlip} />
        </Container>
    );
};

const PaymentsTable = ({ payments, onEdit, onPrint }) => {
    if (payments.length === 0) return <p>No payments found.</p>;

    return (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'lightpink' }}>
                    <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment._id}>
                            <TableCell>{payment.name}</TableCell>
                            <TableCell>{payment.rollNumber}</TableCell>
                            <TableCell>Rs {payment.amount}</TableCell>
                            <TableCell>{payment.class}</TableCell>
                            <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => onEdit(payment)}>
                                    Edit
                                </Button>
                                <Button variant="contained" style={{ backgroundColor: 'green', color: 'white', marginLeft: '8px' }} onClick={() => onPrint(payment)}>
                                    Print Slip
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FeeManagement;
