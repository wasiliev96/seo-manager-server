import whoiser from 'whoiser';
import moment from 'moment';
import {getAllUsersData, getUserData} from "../database/api";
import {getAllUsersDomainsArray} from "./index";
import {sendMessage} from "../bot";

export const getUsersIdList = async () => {
    const usersList = await getAllUsersData();
    // console.log(domainsList)
    // console.log(usersList);
    return usersList.map((userData: any) => userData._id);
}
export const runChecker = async (userId: string) => {
    const userDomainsList = await getUserDomainsList(userId);
    const userDomainsMap = userDomainsList.map((domain: any) => domain.hostname);
    const checkResults: {hostname:string, expiryDate:Date|null}[] = [];
    for (const hostname of userDomainsMap) {
        const hostResult: { hostname: string, expiryDate: Date | null } = {hostname, expiryDate: null};
        try {
            const expiryDate = await checkDomain(hostname);
            if (expiryDate) {
                hostResult.expiryDate = expiryDate;
            }
            // if (hostResult.hostname && hostResult.expiryDate) {
                checkResults.push(hostResult);
            // }

        } catch (error) {
            console.log(`error:`);

            console.log(error);
        }
    }

    // console.log(checkResults);
    return checkResults;
}
export const getUserDomainsList = async (userId: string): Promise<[{ _id: string, hostname: string, uptimes: [], expiryDate: Date }]> => {
    const userData = await getUserData(userId);
    // console.log(userData.domains);
    return userData.domains;
}
export const daysToExpire = (expiryDate: Date|null): number => {
    const diff = moment(expiryDate).diff(new Date(), "days");
    if (Number.isNaN(diff)) {
        return 0;
    }
    return diff;
}
export const checkDomain = async (domain: string) => {
    try {
        const domainInfo = await whoiser(domain);
        return Object.keys(domainInfo).map(
            (registrar) => domainInfo[registrar][`Expiry Date`]
        )[0];
    } catch (error) {
        console.log(`error:`);

        console.log(error);
    }
}

export const whoisRunner = async (usersList: []) => {
    const usersResults: { userId: string, domainsResults: { hostname: string, expiryDate: Date|null }[] }[] = [];
    for (const userId of usersList) {
        const domainsResults: { hostname: string, expiryDate: Date|null }[] = await runChecker(userId);
        usersResults.push({userId, domainsResults});
    }
    return usersResults;
}
