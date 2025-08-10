export default (state, action) => {
    switch(action.type){
        case "set_favourites": 
            return action.payload;
        case "add_favourite":
            return [...state, action.payload];
        case "del_favourite":
            return state.filter(s => s.id !== action.payload);
    }
    return state;

}