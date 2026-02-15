import { toast } from "react-toastify"
export const errorHandle = (response)=>{
if(response.status == 401){
    return toast.error("Email already exist or wrong password ❌")
}else if(response.status == 400){
    return toast.error("All fields are required")
}else if(response.status == 201){
    return toast.success("Successfully registered ✅")
}else if(response.status == 500){
    return response.status("Server Error || Try again later")
}
}