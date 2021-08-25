import { AudioResource } from "@discordjs/voice";

export class Queue {
  resources: AudioResource[];

  constructor() {
    this.resources = [];
  }

  addResource(resource: AudioResource) {
    this.resources.push(resource);
  }

  getNextResource() {
    return this.resources.shift();
  }
}
