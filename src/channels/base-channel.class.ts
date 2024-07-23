import { Flags, EventListener } from "../types";

export default class BaseChannel {
  eventListener?: EventListener;

  update(flags: Flags) {
    if (this.eventListener) {
      this.eventListener(flags);
    }
  }

  onUpdate(eventListener: EventListener) {
    this.eventListener = eventListener;
  }
}
