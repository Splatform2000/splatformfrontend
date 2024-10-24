import axios from 'axios';
import {
    getRequest,
    getAllFeesSuccess,
    getFeesByClassSuccess,
    getFailed,
    addFee,
    clearResponse,
    removeFee,
    getError
} from './feeSlice';

// Base URL for API
const API_URL = 'http://localhost:5000/fees';

// Fetch all fees using Axios
export const fetchFees = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Fetch all fees (Thunk)
export const getAllFees = () => async (dispatch) => {
    dispatch(getRequest());
    try {
        const fees = await fetchFees();
      //  console.log("Fetched Fees with Axios:", fees); // Log fetched fees
        dispatch(getAllFeesSuccess(fees));
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
      //  console.error("Fetch error:", errorMessage); // Log the error
        dispatch(getFailed(errorMessage));
    }
};

// Fetch fees for a specific ID
export const getTotalFees = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${API_URL}/${id}`);
        dispatch(getAllFeesSuccess([result.data])); // Dispatch a single fee wrapped in an array
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
        dispatch(getError(errorMessage));
    }
};

// Create a fee
export const createFee = (feeData) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(API_URL, feeData, {
            headers: { 'Content-Type': 'application/json' },
        });
        dispatch(addFee(result.data)); // Dispatch the added fee
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
        dispatch(getError(errorMessage));
    }
};

// Update a fee
export const updateFee = (feeData) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.put(`${API_URL}/${feeData.id}`, feeData, {
            headers: { 'Content-Type': 'application/json' },
        });
        dispatch(addFee(result.data)); // Dispatch the updated fee
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
        dispatch(getError(errorMessage));
    }
};

// Fetch fees filtered by class
export const getFeesByClass = (className) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${API_URL}/class/${className}`);
        dispatch(getFeesByClassSuccess(result.data)); // Dispatch fees filtered by class
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
        dispatch(getError(errorMessage));
    }
};

// Clear response message
export const resetResponse = () => (dispatch) => {
    dispatch(clearResponse()); // Dispatch the action to clear response
};

// Remove a fee by ID
export const deleteFee = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        await axios.delete(`${API_URL}/${id}`); // Send delete request
        dispatch(removeFee(id)); // Dispatch action to remove fee
    } catch (error) {
        const errorMessage = error.response?.data.message || error.message;
        dispatch(getError(errorMessage)); // Dispatch error action
    }
};
