import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class StompService {
  socket = new SockJS("https://catphish-back-end.azurewebsites.net/ws");
  client = Stomp.over(this.socket);

  constructor() {

  }

  connect() : void {
    this.client.connect();
  }

  subscribe(topic : string, callback? : any, headers? : any) : void {
    const connected : boolean = this.client.connected;

    if (connected) {
      this.subscribeToTopic(topic, callback, headers);

    } else {
      this.client.connect({}, () : void => {
        this.subscribeToTopic(topic, callback, headers);
      });
    }
  }

  private subscribeToTopic(topic : string, callback? : any, headers? : any) : void {
    this.client.subscribe(topic, (frame : any): any => {
      callback(frame);
    }, headers);
  }

  send(topic : string, headers? : any, json? : string) {
    this.client.send(topic, headers, json);
  }

  unsubscribe(topic : string) : void {
    this.client.unsubscribe(topic);
  }

  disconnect() : void {
    this.client.disconnect();
  }
}