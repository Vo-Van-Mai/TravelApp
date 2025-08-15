export default (state, action) => {

    switch(action.type){
        case "set_place":
            return action.payload;
        case "add_place":
            return [...state, action.payload];
        case "del_place":
            return state.filter(s => s.id !== action.payload);
        case "update_place":
            return state.map(s => s.id === action.payload.id ? action.payload : s)
    }
   return state;
}