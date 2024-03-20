import axios from "axios";


export const sendSMS = async (code: string, to: string, time: number) => {
    try {
      const data = {
        to,
        from: "N-Alert",
        sms: `Your Open Retail confirmation code is ${code}. Valid for ${time} minutes, one-time use only.,`,
        type: "plain",
        channel: "dnd",
        api_key: process.env.SMS_PROVIDER_API_KEY,
      };
      const result = await axios({
        method: "post",
        url: process.env.SMS_PROVIDER_URL,
        data: data,
      });
  
      return result.data;
    } catch (error: any) {
      const errorMsg = error.response.data.message;
      console.log("ERROR:SMS:", errorMsg);
      throw errorMsg;
    }
  };