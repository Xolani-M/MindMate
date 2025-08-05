import { jwtDecode } from "jwt-decode";
 
export interface IDecodedToken {
    id: string;
    [AbpTokenProperies.claims]: string;
    sub: string;
    jti: string;
    iat: string;
    nbf: string;
    exp: string;
    iss: string;
    aud: string;
    role?: string;
    [AbpTokenProperies.nameidentifier]: string;
    [AbpTokenProperies.name]: string;
    [AbpTokenProperies.emailaddress]: string;
    [AbpTokenProperies.securitystamp]: string;
    [AbpTokenProperies.role]: string;
}
 
export enum AbpTokenProperies {
    claims = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/",
    sub = "sub",
    jti = "jti",
    iat = "iat",
    nbf = "nbf",
    exp = "exp",
    iss = "iss",
    aud = "aud",
    nameidentifier = `${claims}nameidentifier`, // userId
    name = `${claims}name`,
    emailaddress = `${claims}emailaddress`,
    securitystamp = "AspNet.Identity.SecurityStamp",
    role = `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`,
}
 
export const decodeToken = (accessToken: string): IDecodedToken => {
    return jwtDecode(accessToken);
};
 
export const getRole = (loginObj: { accessToken: string }): string => {
    if (loginObj) {
        const decoded = decodeToken(loginObj.accessToken);
        return `${decoded[AbpTokenProperies.role]}`.toLocaleLowerCase();
    }
 
    return "client";
};
export const getId = (token: string): string => {
    if (token) {
        const decoded = decodeToken(token);
        return `${decoded[AbpTokenProperies.nameidentifier]}`.toLocaleLowerCase();
    }
 
    return "1";
};
 
export const getrole = (token: string): string => {
    if (token) {
        const decoded = decodeToken(token);
        return `${decoded[AbpTokenProperies.role]}`.toLocaleLowerCase();
    }
 
    return "";
};