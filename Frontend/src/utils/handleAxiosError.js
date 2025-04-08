export const handleAxiosError=(error)=>{
    if(error.response)
    {
        console.error("Server Error:",error.response.status);
        return error.response ||"Server Error occured";
    }
    else if(error.request)
    {
        console.error("Network Error:",error.request);
        return "Network Error"|| "No response from server";
    }
    else{
        console.error("Client Error",error.message);
        return "Unexpected Error occured";
    }

}