import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFees } from './feeHandle'; // Import your API function

const initialState = {
    feeData: [],
    loading: false,
    error: null,
    response: null,
    totalFees: 0, // Track total fees
};

// Async thunk to fetch all fees
export const getAllFeesThunk = createAsyncThunk('fees/getAll', async () => {
    const response = await fetchFees();
    return response;
});

const feeSlice = createSlice({
    name: 'fees',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getAllFeesSuccess: (state, action) => {
            state.feeData = action.payload;
            state.loading = false;
            state.error = null;
            // Calculate total fees
            state.totalFees = action.payload.reduce((total, fee) => total + fee.amount, 0);
            state.response = 'All fees fetched successfully';
          //  console.log("Calculated Total Fees:", state.totalFees); // Log total fees
        },
        getFeesByClassSuccess: (state, action) => {
            state.feeData = action.payload;
            state.loading = false;
            state.error = null;
            // Calculate total for class
            state.totalFees = action.payload.reduce((total, fee) => total + fee.amount, 0);
            state.response = 'Fees for class fetched successfully';
        },
        getFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearResponse: (state) => {
            state.response = null;
        },
        addFee: (state, action) => {
            const index = state.feeData.findIndex(fee => fee._id === action.payload._id);
            if (index !== -1) {
                state.totalFees -= state.feeData[index].amount; // Subtract the old amount
                state.feeData[index] = action.payload; // Update existing fee
            } else {
                state.feeData.push(action.payload); // Add new fee
            }
            state.totalFees += action.payload.amount; // Add the new amount
            state.loading = false;
            state.error = null;
            state.response = 'Fee updated successfully';
        },
        removeFee: (state, action) => {
            const feeToRemove = state.feeData.find(fee => fee._id === action.payload);
            if (feeToRemove) {
                state.totalFees -= feeToRemove.amount; // Subtract the fee amount
            }
            state.feeData = state.feeData.filter(fee => fee._id !== action.payload);
            state.loading = false;
            state.error = null;
            state.response = 'Fee removed successfully';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllFeesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllFeesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.feeData = action.payload;
                // Calculate total fees
                state.totalFees = action.payload.reduce((total, fee) => total + fee.amount, 0);
             //   console.log("Calculated Total Fees:", state.totalFees); // Log for debugging
                state.response = 'All fees fetched successfully';
            })
            .addCase(getAllFeesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export actions
export const {
    getRequest,
    getAllFeesSuccess,
    getFeesByClassSuccess,
    getFailed,
    getError,
    clearResponse,
    addFee,
    removeFee
} = feeSlice.actions;

// Selector for totalFees
export const selectTotalFees = (state) => state.fees.totalFees;

export default feeSlice.reducer;
