  export const sendSuccessResponse = (
      res: any,
      statusCode: number,
      data: Record<string, any> | string | null,
      message: string = `successful`
    ) => {
      res.status(statusCode).json({
        message: message,
        status: statusCode,
        data: data,
        success: true,
      });
    };
    
    export const sendErrorResponse = (
      res: any,
      statusCode: number,
      data: any,
      message: string = 'Request failed'
    ) => {
      try {
        return res.status(statusCode).json({
          message: message,
          status: statusCode,
          data: data,
          error: true,
        });
      } catch (error: any) {

        if (error.code === 'ERR_HTTP_HEADERS_SENT') {
          console.error('Error: Headers already sent');
          return; 
        } else {
          throw error;
        }
      }
    };
    
  
  
  