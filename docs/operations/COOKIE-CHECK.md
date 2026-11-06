# Cookie panel — diagnosis and correction

The application mounts CookiePreferences from the root layout, not an individual
page. The footer already exposes a permanent Preferences button. The existing
Dialog is client rendered into a Radix portal with overlay/content layering.

The automatic display condition is enabled && no valid saved preference. Effective
analytics is disabled by default and gated by documented supplier/transfer/log
settings and review. No optional analytics => no automatic consent request. A valid
saved rejection or acceptance also intentionally suppresses it. Do not clear old
preferences or enable analytics merely to make a popup appear.

Code inventory: one optional Vercel Web Analytics injector behind this gate and
consent; Auth/session cookies, local preference memory, optional UI sidebar cookie
are technical. No active GA4/Cookiebot/pixels/maps/video embeds found in the app.
The injector's cookieless design is not treated as consent exemption. External
provider injection/settings and an individual user's storage cannot be inspected
from this session; do not claim a production network scan.

Actual edge defect fixed: failed localStorage persistence could leave React
choice=true even though the event filter rejected it, then reopen the dialog at
the next minute/focus check. It now verifies read-back, fails closed to necessary
only, displays a storage warning and retains a temporary rejection for this tab.
If revocation cannot be saved, do not reload and restore the old acceptance;
the live filter stays denied in the current document. Browser storage controls
may still be needed to remove an older acceptance before a future visit.
No stored user choices are removed. Reload with blocked storage may ask again
because it is impossible to remember across visits. Valid legacy records remain
accepted; new records include explicit cookie notice version and date.

Buttons use identical outline variants and a mobile-first grid. Panel explicit
z-index 100, scrollable within 90dvh; X/Escape choose necessary only; footer reopens
and restores focus. No scroll/navigation consent. Revocation stops live callback,
clears reachable GA legacy identifiers and reloads any previously loaded SDK;
third-party/HttpOnly identifiers and already-sent requests cannot be retracted.

Tests use a clean isolated browser on the actual component/SDK injector, simulated
Next routing and intercepted analytics endpoint: before-choice absence, rejection,
selective acceptance, accept all, reload/navigation, private route blocking,
reopening/revocation, GA cleanup, X/Escape, technical-only mode, malformed/expired
records and denied storage. Desktop 1280x800 / mobile 390x844. This is not a real
provider backend/network capture. Deployment verification is recorded in PR.
No production change or existing preference deletion is part of this correction.
