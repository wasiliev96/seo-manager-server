import whoiser from 'whoiser';
import moment from 'moment';
import {getUserData} from "../database/api";

export const runChecker = async (userId: string, daysToAlert: number) => {
    const userDomainsList = await getUserDomainsList(userId);
    const userDomainsMap = userDomainsList.map((domain: any) => domain.hostname);
    const checkResults: any = [];
    for (const hostname of userDomainsMap) {
        const hostResult: { hostname: string, expiryDate: Date | null } = {hostname, expiryDate: null};
        try {
            const expiryDate = await checkDomain(hostname);
            if (expiryDate) {
                hostResult.expiryDate = expiryDate;
                const diff = daysToExpire(expiryDate);
                // console.log(`diff: ${diff}`);
                if (diff) {
                    if (diff <= daysToAlert) {
                        // console.log(`⚠️⚠️WHOIS ${hostname}:  ${diff} days`);
                        // sendMessage(bot, `⚠️WHOIS ${domain}: ${diff} days`);
                    } else {
                        console.log(`${hostname}: Expiration date in : ${diff} days`);
                    }
                }
            }
            if (hostResult.hostname && hostResult.expiryDate) {
                checkResults.push(hostResult);
            }

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
export const daysToExpire = (expiryDate: string): number => {
    const diff = moment(new Date(expiryDate)).diff(new Date(), "days");
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
