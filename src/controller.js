// SPDX-License-Identifier: GPL-3.0-or-later
/** Independent mod controller. All privileged work uses a bounded, consented host service. */
export class ModController {
  constructor(service) { this.call = service; }
  status() { return this.call("status"); }
  enable(enabled) { if (typeof enabled !== "boolean") throw new TypeError("enabled must be boolean"); return this.call("enable", {enabled}); }
  action(operation, value = null) {
    if (!OPERATIONS.includes(operation)) throw new Error("Unsupported operation: " + operation);
    return this.call(operation, value);
  }
}
export const OPERATIONS = ["backup.create", "backup.restore", "cloud.choose", "cloud.disconnect", "cloud.sync"];
