import {getAllUsersData} from "../database/api";
import {monitoringRunner} from "./uptime";
import {sendMessage} from "../bot";
import {daysToExpire, getUsersIdList, whoisRunner} from "./whois";

export class ServiceHandler {
    public async runUptimesOnce() {
        const results = await monitoringRunner();
        const errorsMessage = getUptimeErrorsMessage(results);
        if (errorsMessage) {
            return await sendMessage(errorsMessage)
        }
        // return false;
    }

    public async runWhoisOnce(daysToAlert: number) {
        const domainsWarning: { hostname: string, daysToExpire: number }[] = [];
        const usersIdList = await getUsersIdList();
        const whoisUsersData = await whoisRunner(usersIdList);
        console.log(JSON.stringify(whoisUsersData, null, 4));
        for (const userData of whoisUsersData) {
            for (const domainResult of userData.domainsResults) {
                const diff = daysToExpire(domainResult.expiryDate);
                if (diff) {
                    if (diff <= daysToAlert) {
                        domainsWarning.push({hostname: domainResult.hostname, daysToExpire: diff})
                    } else {
                        console.log(`${domainResult.hostname}: Expiration date in : ${diff} days`);
                    }
                }
            }
        }
        const warningMessage = getWhoisErrorMessage(domainsWarning);
        if (warningMessage) {
            await sendMessage(warningMessage);
        }
    }
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
export const getUptimeErrorsMessage = (results: { hostname: string, accessAccepted: boolean }[]) => {
    const messageTitle = `Can't access to list of domains:\n`;
    let messageBody: string | undefined;
    results.forEach((result) => {
        if (!result.accessAccepted) {
            messageBody += result.hostname + '\n';
        }
    })
    return messageBody ? messageTitle + messageBody : null;
}

export const getWhoisErrorMessage = (domainsWarning: { hostname: string, daysToExpire: number }[]): string | null => {
    const messageTitle = `Whois domains expires:\n`;
    let messageBody: string | undefined;
    if (domainsWarning.length > 0) {
        for (const domainWarning of domainsWarning) {
            messageBody += `${domainWarning.hostname}: ${domainWarning.daysToExpire} days`
        }
    }
    return messageBody ? messageTitle + messageBody : null;
}
