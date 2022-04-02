export const login = (username) => {
    console.log(username);
    
    sessionStorage.setItem("username", username);
}
export const logout = () => {
    sessionStorage.removeItem("username");
}
export const getUser = () => {
    return sessionStorage.getItem("username")
}