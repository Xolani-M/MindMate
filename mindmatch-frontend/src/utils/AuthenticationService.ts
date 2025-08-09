/**
 * Authentication utility service class
 * Provides centralized authentication operations and token management
 */
export class AuthenticationService {
    
    //#region Constants
    
    /**
     * Key used for storing JWT token in session storage
     */
    public readonly TOKEN_STORAGE_KEY: string = "token";
    
    /**
     * Key used for storing user role in session storage
     */
    public readonly ROLE_STORAGE_KEY: string = "role";
    
    /**
     * Key used for storing user ID in session storage
     */
    public readonly USER_ID_STORAGE_KEY: string = "Id";
    
    /**
     * Key used for storing seeker ID in session storage
     */
    public readonly SEEKER_ID_STORAGE_KEY: string = "SeekerId";
    
    /**
     * Default role assigned when no role is found
     */
    public readonly DEFAULT_ROLE: string = "client";
    
    //#endregion Constants
    
    //#region Public Variables
    
    /**
     * Indicates if the service has been initialized
     */
    public isInitialized: boolean = false;
    
    //#endregion Public Variables
    
    //#region Private Variables
    
    /**
     * Current authentication token
     */
    private _currentToken: string | null = null;
    
    /**
     * Current user role
     */
    private _currentRole: string = this.DEFAULT_ROLE;
    
    /**
     * Current user ID
     */
    private _currentUserId: string | null = null;
    
    /**
     * Current seeker ID
     */
    private _currentSeekerId: string | null = null;
    
    /**
     * Timestamp when token was last validated
     */
    private _lastValidationTime: number = 0;
    
    //#endregion Private Variables
    
    //#region Constructor
    
    /**
     * Creates a new instance of AuthenticationService
     * Initializes the service and loads existing session data
     */
    constructor() {
        this._initializeService();
    }
    
    //#endregion Constructor
    
    //#region Public Methods
    
    /**
     * Stores authentication data in session storage
     * 
     * @param token - JWT authentication token
     * @param role - User role in the application
     * @param userId - Unique user identifier
     * @param seekerId - Optional seeker profile identifier
     */
    public storeAuthenticationData(token: string, role: string, userId: string, seekerId?: string): void {
        if (typeof window === "undefined") {
            return;
        }
        
        this._currentToken = token;
        this._currentRole = role;
        this._currentUserId = userId;
        this._currentSeekerId = seekerId || null;
        
        sessionStorage.setItem(this.TOKEN_STORAGE_KEY, token);
        sessionStorage.setItem(this.ROLE_STORAGE_KEY, role);
        sessionStorage.setItem(this.USER_ID_STORAGE_KEY, userId);
        
        if (seekerId) {
            sessionStorage.setItem(this.SEEKER_ID_STORAGE_KEY, seekerId);
        }
        
        this._lastValidationTime = Date.now();
    }
    
    /**
     * Retrieves the current authentication token
     * 
     * @returns Current JWT token or null if not authenticated
     */
    public getCurrentToken(): string | null {
        return this._currentToken;
    }
    
    /**
     * Retrieves the current user role
     * 
     * @returns Current user role or default role if not authenticated
     */
    public getCurrentRole(): string {
        return this._currentRole;
    }
    
    /**
     * Retrieves the current user ID
     * 
     * @returns Current user ID or null if not authenticated
     */
    public getCurrentUserId(): string | null {
        return this._currentUserId;
    }
    
    /**
     * Retrieves the current seeker ID
     * 
     * @returns Current seeker ID or null if not available
     */
    public getCurrentSeekerId(): string | null {
        return this._currentSeekerId;
    }
    
    /**
     * Checks if the user is currently authenticated
     * 
     * @returns True if user has a valid token, false otherwise
     */
    public isAuthenticated(): boolean {
        return this._currentToken !== null && this._currentToken.length > 0;
    }
    
    /**
     * Clears all authentication data and logs out the user
     */
    public clearAuthentication(): void {
        this._currentToken = null;
        this._currentRole = this.DEFAULT_ROLE;
        this._currentUserId = null;
        this._currentSeekerId = null;
        this._lastValidationTime = 0;
        
        if (typeof window !== "undefined") {
            sessionStorage.removeItem(this.TOKEN_STORAGE_KEY);
            sessionStorage.removeItem(this.ROLE_STORAGE_KEY);
            sessionStorage.removeItem(this.USER_ID_STORAGE_KEY);
            sessionStorage.removeItem(this.SEEKER_ID_STORAGE_KEY);
        }
    }
    
    /**
     * Validates if the current token is still valid
     * 
     * @returns True if token exists and is not expired, false otherwise
     */
    public validateCurrentToken(): boolean {
        if (!this._currentToken) {
            return false;
        }
        
        try {
            // Basic validation - decode token and check expiration
            const payload = JSON.parse(atob(this._currentToken.split(".")[1]));
            const currentTime: number = Math.floor(Date.now() / 1000);
            
            return payload.exp > currentTime;
        } catch (error) {
            console.error("Token validation failed:", error);
            return false;
        }
    }
    
    //#endregion Public Methods
    
    //#region Private Methods
    
    /**
     * Initializes the authentication service
     * Loads existing session data if available
     */
    private _initializeService(): void {
        if (typeof window === "undefined") {
            this.isInitialized = true;
            return;
        }
        
        this._loadSessionData();
        this.isInitialized = true;
    }
    
    /**
     * Loads authentication data from session storage
     */
    private _loadSessionData(): void {
        const token: string | null = sessionStorage.getItem(this.TOKEN_STORAGE_KEY);
        const role: string | null = sessionStorage.getItem(this.ROLE_STORAGE_KEY);
        const userId: string | null = sessionStorage.getItem(this.USER_ID_STORAGE_KEY);
        const seekerId: string | null = sessionStorage.getItem(this.SEEKER_ID_STORAGE_KEY);
        
        if (token) {
            this._currentToken = token;
            this._currentRole = role || this.DEFAULT_ROLE;
            this._currentUserId = userId;
            this._currentSeekerId = seekerId;
            this._lastValidationTime = Date.now();
        }
    }
    
    /**
     * Validates the format of a JWT token
     * 
     * @param token - Token string to validate
     * @returns True if token has valid JWT format, false otherwise
     */
    private _isValidTokenFormat(token: string): boolean {
        const parts: string[] = token.split(".");
        return parts.length === 3;
    }
    
    //#endregion Private Methods
}
