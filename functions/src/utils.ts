import * as functions from 'firebase-functions';


export const createResponse = (response: functions.Response, status = 200, data: any) => {
    return response.status(status).send({data: data});
}
