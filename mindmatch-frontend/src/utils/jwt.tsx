import { jwtDecode } from "jwt-decode";
 
/**
 * Interface defining the structure of a decoded JWT token
 * Contains standard JWT claims and custom application claims
 */
export interface IDecodedToken {
    /**
     * User identifier claim
     */
    id?: string;
    
    /**
     * Subject claim - typically the user ID
     */
    sub?: string;
    
    /**
     * JWT ID claim - unique identifier for the token
     */
    jti?: string;
    
    /**
     * Issued at time claim - timestamp when token was created
     */
    iat?: string;
    
    /**
     * Not before claim - timestamp before which token is not valid
     */
    nbf?: string;
    
    /**
     * Expiration time claim - timestamp when token expires
     */
    exp?: string;
    
    /**
     * Issuer claim - who issued the token
     */
    iss?: string;
    
    /**
     * Audience claim - intended recipient of the token
     */
    aud?: string;
    
    /**
     * Role claim - user's role in the application
     */
    role?: string;
    
    /**
     * Additional custom claims can be present
     */
    [key: string]: string | undefined;
}

/**
 * Enumeration of standard ABP token properties
 * Maps to standard JWT claim URIs used by ABP framework
 */
export enum AbpTokenProperies {
    /**
     * Base URI for identity claims
     */
    claims = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/",
    
    /**
     * Subject claim identifier
     */
    sub = "sub",
    
    /**
     * JWT ID claim identifier
     */
    jti = "jti",
    
    /**
     * Issued at time claim identifier
     */
    iat = "iat",
    
    /**
     * Not before claim identifier
     */
    nbf = "nbf",
    
    /**
     * Expiration time claim identifier
     */
    exp = "exp",
    
    /**
     * Issuer claim identifier
     */
    iss = "iss",
    
    /**
     * Audience claim identifier
     */
    aud = "aud",
    
    /**
     * Name identifier claim - contains user ID
     */
    nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    
    /**
     * Name claim - contains user's name
     */
    name = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    
    /**
     * Email address claim
     */
    emailaddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    
    /**
     * Security stamp claim for ASP.NET Identity
     */
    securitystamp = "AspNet.Identity.SecurityStamp",
    
    /**
     * Role claim - contains user's role
     */
    role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
}

/**
 * Decodes a JWT access token and returns the parsed claims
 * 
 * @param accessToken - The JWT token string to decode
 * @returns Decoded token object with all claims
 */
export const decodeToken = (accessToken: string): IDecodedToken => {
    return jwtDecode<IDecodedToken>(accessToken);
};
 
/**
 * Extracts the user role from a JWT token
 * 
 * @param loginObj - Either a token string or an object containing accessToken
 * @returns User role as lowercase string, defaults to "client" if not found
 */
export const getRole = (loginObj: { accessToken: string } | string): string => {
    const token: string = typeof loginObj === "string" ? loginObj : loginObj.accessToken;
    if (token) {
        const decoded: IDecodedToken = decodeToken(token);
        return `${decoded[AbpTokenProperies.role] || ""}`.toLowerCase();
    }
    return "client";
};

/**
 * Extracts the user ID from a JWT token
 * Prioritizes seekerId if present, otherwise falls back to nameidentifier
 * 
 * @param token - The JWT token string
 * @returns User ID string, defaults to "1" if not found
 */
export const getId = (token: string): string => {
    if (token) {
        const decoded: IDecodedToken = decodeToken(token);
        // Use seekerId if present, otherwise fallback to nameidentifier
        return `${decoded["seekerId"] || decoded[AbpTokenProperies.nameidentifier] || ""}`;
    }
    return "1";
};