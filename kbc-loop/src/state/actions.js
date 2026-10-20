// Leesbare actie-functies bovenop dispatch, zodat schermen geen action-types hoeven te kennen.
export function bindActions(dispatch) {
  return {
    reset: () => dispatch({ type: 'RESET' }),
    setView: (view) => dispatch({ type: 'SET_VIEW', view }),
    switchCustomer: (customerId) => dispatch({ type: 'SWITCH_CUSTOMER', customerId }),
    setConsent: (value) => dispatch({ type: 'SET_CONSENT', value }),
    navigate: (screen, active = {}) => dispatch({ type: 'NAVIGATE', screen, active }),
    openKate: () => dispatch({ type: 'OPEN_KATE' }),
    closeKate: () => dispatch({ type: 'CLOSE_KATE' }),
    dismissSignal: (signalId) => dispatch({ type: 'DISMISS_SIGNAL', signalId }),
    borrow: (productId) => dispatch({ type: 'BORROW', productId }),
    reportDefect: (itemKey, issue, preventive = false) => dispatch({ type: 'REPORT_DEFECT', itemKey, issue, preventive }),
    advanceRepair: (itemKey) => dispatch({ type: 'ADVANCE_REPAIR', itemKey }),
    closeRepair: (itemKey) => dispatch({ type: 'CLOSE_REPAIR', itemKey }),
    returnItem: (itemKey) => dispatch({ type: 'RETURN_ITEM', itemKey }),
    triggerTelemetry: () => dispatch({ type: 'TRIGGER_TELEMETRY' }),
    toggleCampaign: (segmentId) => dispatch({ type: 'TOGGLE_CAMPAIGN', segmentId }),
  }
}
