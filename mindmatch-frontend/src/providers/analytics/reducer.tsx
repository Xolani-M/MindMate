import { IAnalyticsStateContext } from "./context";
import { AnalyticsAction, AnalyticsActionEnums } from "./actions";

export function analyticsReducer(
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
