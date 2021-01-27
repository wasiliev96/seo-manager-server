import {getAllUsersData} from "../database/api";

export class ServiceHandler {

}

let usersData: any;
export const updateUsersData = async () => {
    usersData = await getAllUsersData();
    return usersData;
}
export const getAllUsersDomainsArray = async () => {
    if (!usersData) {
        usersData = await getAllUsersData();
    }
    return usersData.map((user: any) => {
        return user.domains.map((domain: any) => (domain.hostname))
    }).flat();
}
