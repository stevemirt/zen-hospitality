import Script from "next/script";

/**
 * Pipedrive LeadBooster chatbot loader.
 *
 * Rendered alongside the floating WhatsApp button. Pipedrive injects its own
 * launcher bubble (bottom-right) and chat UI, so there's no markup to render
 * here beyond the two scripts:
 *   1. Inline config that defines `window.pipedriveLeadboosterConfig` and the
 *      `LeadBooster` command queue — must run before the loader.
 *   2. The async loader that boots the chat once config + queue exist.
 *
 * Both use `afterInteractive` so they load after the page is interactive
 * without blocking the cinematic hero; Next preserves their declared order.
 */
export function PipedriveChat() {
  return (
    <>
      <Script id="pipedrive-leadbooster-config" strategy="afterInteractive">
        {`window.pipedriveLeadboosterConfig = {base: 'leadbooster-chat.pipedrive.com',companyId: 16140121,playbookUuid: '9b9b3b8c-3064-4c19-b49f-aebe9ab8077b',version: 2};(function () {var w = window;if (w.LeadBooster) {console.warn('LeadBooster already exists');} else {w.LeadBooster = {q: [],on: function (n, h) {this.q.push({ t: 'o', n: n, h: h });},trigger: function (n) {this.q.push({ t: 't', n: n });},};}})();`}
      </Script>
      <Script
        src="https://leadbooster-chat.pipedrive.com/assets/loader.js"
        strategy="afterInteractive"
      />
    </>
  );
}
