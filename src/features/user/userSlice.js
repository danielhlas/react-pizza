import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


//
//REDUX TOOLKIT:
//
const initialState = {
  name: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};


export const fetchAddress = createAsyncThunk("user/fetchAddress",
	async function() {
	  // 1) We get the user's geolocation position
		const positionObj = await getPosition();
	  const position = {
	    latitude: positionObj.coords.latitude,
	    longitude: positionObj.coords.longitude,
	  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
	  const addressObj = await getAddress(position);
	  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  return { position, address };
}
		
)

const userSlice = createSlice({
  name: "user", 
  initialState,
  reducers: {   
	  changeName(state, action) {
      state.name = action.payload;
		 },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAddress.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAddress.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.address = action.payload;
        })
        .addCase(fetchAddress.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
    //rejected případ je např. když uživatel neakceptuje geolocation
    //buildery se řetězí, proto tečky
});

export const getName = (state) => state.user.name; 


export const {changeName} = userSlice.actions //export action creatoru
export default userSlice.reducer; // export reduceru