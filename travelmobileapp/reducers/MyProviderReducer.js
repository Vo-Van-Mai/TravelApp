export default (state, action) => {
    switch(action.type){
        case "set_provider":
            return action.payload;
        case "update_provider":
            return {...state, ...action.payload};
    }
    return state;
}