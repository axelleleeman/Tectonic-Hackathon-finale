// Kate's conversation engine (framework-free), shared by apps/app and packages/web-ui.
export {
  REPLY_BEFORE_ACTION_MS, answerIntent, capabilitiesReply, conversationContext, greeting, respond, suggestions,
  unknownReply, voiceNotAvailableReply,
} from './conversation.js'
export { INTENTS, detectIntent } from './intents.js'
export { CHIP_LABELS, KATE_TEXT } from './texts.js'
