
import { createContext, useContext, useReducer, useMemo } from "react";
import axios from "axios";

// --- Analytics Types ---
export interface IAnalyticsData {
	id: string;
	metric: string;
	value: number;
	timestamp: string;
}

export interface IAnalyticsStateContext {
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	analytics?: IAnalyticsData[];
}

export interface IAnalyticsActionContext {
	getAnalytics: () => void;
	refreshAnalytics: () => void;
}

export const ANALYTICS_INITIAL_STATE: IAnalyticsStateContext = {
	isPending: false,
	isSuccess: false,
	isError: false,
	analytics: [],
};

export const AnalyticsStateContext = createContext<IAnalyticsStateContext>(ANALYTICS_INITIAL_STATE);
export const AnalyticsActionContext = createContext<IAnalyticsActionContext | undefined>(undefined);

// --- Analytics Actions ---
export enum AnalyticsActionEnums {
	getAnalyticsPending = "GET_ANALYTICS_PENDING",
	getAnalyticsSuccess = "GET_ANALYTICS_SUCCESS",
	getAnalyticsError = "GET_ANALYTICS_ERROR",
}

type AnalyticsAction =
	| { type: AnalyticsActionEnums.getAnalyticsPending }
	| { type: AnalyticsActionEnums.getAnalyticsSuccess; payload: IAnalyticsData[] }
	| { type: AnalyticsActionEnums.getAnalyticsError };

// --- Analytics Reducer ---
function analyticsReducer(
	state: IAnalyticsStateContext,
	action: AnalyticsAction
): IAnalyticsStateContext {
	switch (action.type) {
		case AnalyticsActionEnums.getAnalyticsPending:
			return { ...state, isPending: true, isSuccess: false, isError: false };
		case AnalyticsActionEnums.getAnalyticsSuccess:
			return {
				...state,
				isPending: false,
				isSuccess: true,
				isError: false,
				analytics: action.payload,
			};
		case AnalyticsActionEnums.getAnalyticsError:
			return { ...state, isPending: false, isSuccess: false, isError: true };
		default:
			return state;
	}
}

// --- Analytics Provider ---

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(analyticsReducer, ANALYTICS_INITIAL_STATE);

	// Ensure return type is void
	const getAnalytics = () : void => {
		(async () => {
			dispatch({ type: AnalyticsActionEnums.getAnalyticsPending });
			try {
				// Example endpoint, replace with your real analytics API
				const endpoint = `/api/analytics`;
				const response = await axios.get(endpoint);
				dispatch({ type: AnalyticsActionEnums.getAnalyticsSuccess, payload: response.data });
			} catch (error) {
				console.error(error);
				dispatch({ type: AnalyticsActionEnums.getAnalyticsError });
			}
		})();
	};

	const refreshAnalytics = () : void => {
		getAnalytics();
	};

	// Memoize actions to avoid recreating object on every render
	const actions = useMemo(() => ({ getAnalytics, refreshAnalytics }), []);

	return (
		<AnalyticsStateContext.Provider value={state}>
			<AnalyticsActionContext.Provider value={actions}>
				{children}
			</AnalyticsActionContext.Provider>
		</AnalyticsStateContext.Provider>
	);
};

export const useAnalyticsState = () => {
	const context = useContext(AnalyticsStateContext);
	if (!context) {
		throw new Error("useAnalyticsState must be used within an AnalyticsProvider");
	}
	return context;
};

export const useAnalyticsActions = () => {
	const context = useContext(AnalyticsActionContext);
	if (!context) {
		throw new Error("useAnalyticsActions must be used within an AnalyticsProvider");
	}
	return context;
};
