import { jwtDecode } from "jwt-decode";
 
export interface IDecodedToken {
    id?: string;
    sub?: string;
    jti?: string;
    iat?: string;
    nbf?: string;
    exp?: string;
    iss?: string;
    aud?: string;
    role?: string;
    [key: string]: string | undefined;
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
    nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", // userId
    name = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    emailaddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    securitystamp = "AspNet.Identity.SecurityStamp",
    role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
}
 
export const decodeToken = (accessToken: string): IDecodedToken => {
    return jwtDecode<IDecodedToken>(accessToken);
};
 
export const getRole = (loginObj: { accessToken: string } | string): string => {
    const token = typeof loginObj === 'string' ? loginObj : loginObj.accessToken;
    if (token) {
        const decoded = decodeToken(token);
        return `${decoded[AbpTokenProperies.role] || ''}`.toLocaleLowerCase();
    }
    return "client";
};

export const getId = (token: string): string => {
    if (token) {
        const decoded = decodeToken(token);
        // Use seekerId if present, otherwise fallback to nameidentifier
        return `${decoded['seekerId'] || decoded[AbpTokenProperies.nameidentifier] || ''}`;
    }
    return "1";
};