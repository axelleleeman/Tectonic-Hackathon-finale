// Readable action functions on top of dispatch, so screens do not need to know action types.
export function bindActions(dispatch) {
  return {
    reset: () => dispatch({ type: 'RESET' }),
    setView: (view) => dispatch({ type: 'SET_VIEW', view }),
    switchCustomer: (customerId) => dispatch({ type: 'SWITCH_CUSTOMER', customerId }),
    setConsent: (value) => dispatch({ type: 'SET_CONSENT', value }),
    // preferences: { kateTips?, insights?, partners?, telemetry? } (booleans only)
    setDataPreferences: (preferences) => dispatch({ type: 'SET_DATA_PREFERENCES', preferences }),
    navigate: (screen, active = {}) => dispatch({ type: 'NAVIGATE', screen, active }),
    openKate: () => dispatch({ type: 'OPEN_KATE' }),
    closeKate: () => dispatch({ type: 'CLOSE_KATE' }),
    dismissSignal: (signalId) => dispatch({ type: 'DISMISS_SIGNAL', signalId }),
    borrow: (productId) => dispatch({ type: 'BORROW', productId }),
    // note: optional free text (max 200 chars); photo: true when the user attached a photo in the UI
    reportDefect: (itemKey, issue, preventive = false, note = null, photo = false) =>
      dispatch({ type: 'REPORT_DEFECT', itemKey, issue, preventive, note, photo }),
    advanceRepair: (itemKey) => dispatch({ type: 'ADVANCE_REPAIR', itemKey }),
    closeRepair: (itemKey) => dispatch({ type: 'CLOSE_REPAIR', itemKey }),
    returnItem: (itemKey) => dispatch({ type: 'RETURN_ITEM', itemKey }),
    upgradeItem: (itemKey, productId) => dispatch({ type: 'UPGRADE_ITEM', itemKey, productId }),
    triggerTelemetry: () => dispatch({ type: 'TRIGGER_TELEMETRY' }),
    toggleCampaign: (segmentId) => dispatch({ type: 'TOGGLE_CAMPAIGN', segmentId }),
    // audience: 'consented' | 'consented-active'; budget in EUR (0–100000); message max 280 chars
    startCampaign: (segmentId, { audience, budget, message } = {}) =>
      dispatch({ type: 'START_CAMPAIGN', segmentId, audience, budget, message }),
    stopCampaign: (segmentId) => dispatch({ type: 'STOP_CAMPAIGN', segmentId }),
    redeemReward: (rewardId) => dispatch({ type: 'REDEEM_REWARD', rewardId }),
    // ids: up to 100 notification ids (see notificationsFor in state/derive.js)
    markNotificationsRead: (ids) => dispatch({ type: 'MARK_NOTIFICATIONS_READ', ids }),
    // status: 'scheduled' | 'on-the-way' | 'in-progress' | 'repaired'; customerId defaults to the active customer
    partnerUpdateRepair: (itemKey, status, customerId) =>
      dispatch({ type: 'PARTNER_UPDATE_REPAIR', itemKey, status, ...(customerId ? { customerId } : {}) }),
  }
}
