export default (state, action) => {
    switch(action.type){
        case "set_tour": 
            return action.payload;
        case "add_tour":
            return [...state, action.payload];
        case "del_tour":
            return state.filter(s => s.id !== action.payload);
    }
    return state;

}