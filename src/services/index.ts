import {getAllUsersData} from "../database/api";
import {monitoringRunner} from "./uptime";
import {sendMessage} from "../bot";
import {daysToExpire, getUsersIdList, whoisRunner} from "./whois";

export class ServiceHandler {
    private readonly uptimeInterval: number;
    private readonly whoisInterval: number;
    private readonly whoisDaysToAlert: number;

    constructor(uptimeInterval = 20_000, whoisInterval = (1_000 * 60 * 60 * 24), whoisDaysToAlert = 110) {
        this.uptimeInterval = uptimeInterval;
        this.whoisDaysToAlert = whoisDaysToAlert;
        this.whoisInterval = whoisInterval; // convert to milliseconds
    }

    public runAllLoop = async () => {
        await Promise.all([this.runUptimesLoop(), this.runWhoisLoop()]);
    }
    public runAllOnce = async () => {
        return await Promise.all([this.runUptimesOnce(), this.runWhoisOnce()]);
    }
    public runUptimesOnce = async () => {
        const results = await monitoringRunner();
        const errorsMessage = getUptimeErrorsMessage(results);
        if (errorsMessage) {
            return await sendMessage(errorsMessage)
        }
        // return false;
    }

    public runWhoisOnce = async () => {
        const domainsWarning: { hostname: string, daysToExpire: number }[] = [];
        const usersIdList = await getUsersIdList();
        const whoisUsersData = await whoisRunner(usersIdList);
        // console.warn(JSON.stringify(whoisUsersData, null, 4));
        for (const userData of whoisUsersData) {
            for (const domainResult of userData.domainsResults) {
                if (domainResult.hostname.includes('azure')) {
                    console.info('\x1b[36m%s\x1b[0m', `azure websites are not supported!`)
                    continue
                }
                ;
                const diff = daysToExpire(domainResult.expiryDate);
                // console.warn(domainResult);
                if (diff) {
                    if (diff <= this.whoisDaysToAlert && domainResult.hostname) {
                        domainsWarning.push({hostname: domainResult.hostname, daysToExpire: diff});
                        // console.warn(domainsWarning)
                    } else {
                        console.warn(`${domainResult.hostname}: Expiration date in : ${diff} days`);
                    }
                } else {
                    console.warn(`${domainResult.hostname}:~${domainResult.expiryDate}~`);
                    domainsWarning.push({hostname: domainResult.hostname, daysToExpire: 0});
                }
            }
        }
        const warningMessage = getWhoisErrorMessage(domainsWarning);
        // console.info(`warning message:`, warningMessage);
        if (warningMessage) {
            return await sendMessage(warningMessage);
        }
    }

    public runUptimesLoop = async () => {
        await infiniteAsyncLoop(this.runUptimesOnce, this.uptimeInterval);
    }

    public runWhoisLoop = async () => {
        await infiniteAsyncLoop(this.runWhoisOnce, this.whoisInterval);
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
    const messageTitle = `Uptime report:\n`;
    let messageBody: string | undefined;
    results.forEach((result) => {
        if (!result.accessAccepted) {
            messageBody += result.hostname + '\n';
        }
    })
    return messageBody ? messageTitle + messageBody : null;
}

export const getWhoisErrorMessage = (domainsWarning: { hostname: string, daysToExpire: number }[]): string | null => {
    const messageTitle = `Whois report:\n`;
    let messageBody: string = '';
    if (domainsWarning.length > 0) {
        for (const domainWarning of domainsWarning) {
            messageBody += `${domainWarning.hostname}: ${domainWarning.daysToExpire || 'EXPIRED!'} days`
        }
    }
    return messageBody ? messageTitle + messageBody : null;
}


export const infiniteAsyncLoop = async (asyncFunc: () => Promise<any>, interval: number) => {
    while (true) {
        await new Promise(async (resolve) => {
            await asyncFunc().then(() => {
                setTimeout(resolve, interval);
            })
        });
    }
}
