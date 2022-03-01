import { CONSTANTS, APIENDPOINTS } from "../common/constants"


class InvestmentDataService {

    constructor() {
    }


    public async getInvestmentList() {

        return fetch(`${CONSTANTS.BASE_PATH}${APIENDPOINTS.QUERY_INVESTMENTS}`).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('getInvestment Api Failed');
        })
    }



    public async postInvestment(reqBody: any) {

        return fetch(`${CONSTANTS.BASE_PATH}${APIENDPOINTS.QUERY_INVESTMENTS}`, {
            // content-type header should not be specified!
            method: 'POST',
            body: reqBody,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('postInvestment Api Failed');
        })

    }



    public async updateInvestmentList(reqBody: any) {

        return fetch(`${CONSTANTS.BASE_PATH}${APIENDPOINTS.UPDATE_INVESTMENT_ORDER}`, {
            // content-type header should not be specified!
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('updateInvestmentList Api Failed')
        })
    }



    public async getthumbnailbyFileId(thumbnail: string) {

        return fetch(`${CONSTANTS.BASE_PATH}${APIENDPOINTS.GET_FILE_BY_FILEID}` + thumbnail).then((response) => {
            if (response.ok) {
                return response
            }
            throw new Error('getthumbnailbyFileId Api Failed')
        })
    }


    public async getInvestmentByPosition(position: number) {

        return fetch(`${CONSTANTS.BASE_PATH}${APIENDPOINTS.QUERY_SINGLE_INVESTMENT}` + position).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('getInvestmentByPosition Api Failed')
        })
    }


}


export default new InvestmentDataService()