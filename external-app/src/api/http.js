import axios from "axios"
import { getToken } from "../helpers/utility";
export const init = () => {
    const token = getToken()
    console.log(token);
    axios.defaults.headers.get['authorization'] = `Bearer ${token}`;
    axios.defaults.headers.post['authorization'] = `Bearer ${token}`;
    axios.defaults.headers.put['authorization'] = `Bearer ${token}`;
    axios.defaults.headers.delete['authorization'] = `Bearer ${token}`;
    axios.defaults.headers.delete['Content-Type'] = `application/json;charset=UTF-8`;
}
init()
export const  http = axios 
