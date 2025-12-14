import "server-only"
import arcjet, {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  fixedWindow
} from "@arcjet/next";
import { env } from "./env";


export {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  fixedWindow
}

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['fingerprint'],
  rules: [
    shield({
      mode: "LIVE"
    })
  ]
})
